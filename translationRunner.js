const files = [],
    res = {},
    messages = {},
    fs = require('fs'),
    path = require('path');

function flatten(data) {
    const result = {};

    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (let i = 0, l = cur.length; i < l; i++) {
                recurse(cur[i], prop ? `${prop}.${i}` : `${i}`);

                if (l === 0) {
                    result[prop] = [];
                }
            }
        } else {
            let isEmpty = true;

            for (const p in cur) {
                if (Object.prototype.hasOwnProperty.call(cur, p)) {
                    isEmpty = false;
                    recurse(cur[p], prop ? `${prop}.${p}` : p);
                }
            }

            if (isEmpty) {
                result[prop] = {};
            }
        }
    }

    recurse(data, '');

    return result;
}

function getFiles(src, def, res) {
    fs.readdirSync(src).forEach(fileName => {
        const file = path.resolve(src, fileName);

        if (fs.lstatSync(file).isDirectory()) {
            getFiles(`${src}/${fileName}`, def, res);
        } else if (fileName.includes(def)) {
            res.push(`${src}/${fileName}`);
        }
    });
}

getFiles('./src', 'i18n', files);

files.forEach(intlFile => {
    const intl = require(intlFile);

    for (const locale in intl) {
        if (!intl.hasOwnProperty(locale)) {
            continue;
        }

        if (messages[locale]) {
            Object.assign(messages[locale], intl[locale]);
        } else {
            messages[locale] = intl[locale];
        }
    }
});

for (const locale in messages) {
    if (!messages.hasOwnProperty(locale)) {
        continue;
    }

    res[locale] = flatten(messages[locale]);
}

fs.writeFileSync('./src/intl/Intl.js', `const intlData = ${JSON.stringify(res)}; export default intlData;`);
