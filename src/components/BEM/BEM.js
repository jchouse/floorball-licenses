/**
 * Class represent bem cls
 *
 * Examples
 * var bem = new BEM('blockName');
 * bem.cls(); --> blockName
 * bem.mods('modName').cls(); --> blockName blockName--modName
 * bem.mods(['modName', 'modName1']).cls(); --> blockName blockName--modName blockName--modName1
 * bem.mods(['modName', false, 'modName2']).cls(); --> blockName blockName--modName blockName--modName2
 * bem.elem('elemName').cls(); --> blockName__elemName
 * bem.elem('elemName').mods('modName').cls(); --> blockName__elemName blockName__elemName--modName
 */
class bem {
    /**
     * Create a blocks css class
     *
     * @param {string} bn - set block name css
     */
    constructor(bn) {
        this.bn = bn;
    }

    /**
     * Get css string
     *
     * @return {string} the css classname
     */
    cls(mixCls) {
        const that = this,
            {bn, _elemStr, _modsStr} = this;
        let str = bn;

        if (_elemStr) {
            str = `${bn}__${_elemStr}`;
        }

        if (_modsStr && _modsStr.map) {
            let mod = [];

            _modsStr.forEach(m => {
                if (m) {
                    mod.push(that._mod(str, m));
                }
            });

            mod = mod.join(' ');
            str = [str, mod].join(' ');
        } else if (_modsStr) {
            str = [str, that._mod(str, _modsStr)].join(' ');
        }

        this._elemStr = null;
        this._modsStr = null;

        if (mixCls) {
            str = [mixCls, str].join(' ');
        }

        return str;
    }

    _mod(name, mod) {
        return `${name}--${mod}`;
    }

    /**
     * Set class mods
     *
     * @param {string|object} the css mods in bem notation
     */
    mods(mods) {
        this._modsStr = mods;
        return this;
    }

    /**
     * Set elems name
     *
     * @param {string} the css mods in bem notation
     */
    elem(elem) {
        this._elemStr = elem;
        return this;
    }
}

export default bem;
