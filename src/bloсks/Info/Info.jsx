/* eslint-disable max-len */
import React from 'react';
import { Grid, Cell } from 'react-md';
import BEM from '../../components/BEM/BEM';
import './Info.css';

/**
 * Info
 */
export default class Info extends React.Component {
    static defaultProps = {
        bem: new BEM('info')
    };

    render() {
        const { bem } = this.props;

        return (
            <Grid className={bem.cls()}>
                <Cell size={8} offset={2} className={bem.elem('article').cls()}>
                    <h3 className={bem.elem('h').cls()}>
                        Ласкаво просимо!
                    </h3>
                    <p className={bem.elem('p').cls()}>
                        Документи для отримання ліцензії:
                    </p>
                    <ul className={bem.elem('ul').cls()}>
                        <li>
                            <a target='_blank' rel='noopener noreferrer' href='https://drive.google.com/open?id=0BxUTl2tZteY0R0I1Z3Y2Yjd0aVU'>
                                Положення про ліцензування.
                            </a>
                        </li>
                        <li>
                            <a target='_blank' rel='noopener noreferrer' href='https://drive.google.com/open?id=0BxUTl2tZteY0akhoZmZIOWktaW8'>
                                Весь пакет документів.
                            </a>
                        </li>
                    </ul>
                    <p className={bem.elem('p').cls()}>
                        На що потрібно звернути увагу:
                    </p>
                    <p className={bem.elem('p').cls()}>
                        Заборгованність
                    </p>
                    <ol className={bem.elem('ul').cls()}>
                        <li className={bem.elem('li').cls()}>
                            Якщо у Клубу є заборгованність по документам чи оплаті, ліцензії на новий сезон видаватись не будут.
                        </li>
                    </ol>
                    <p className={bem.elem('p').cls()}>
                        Лист заява від клубу:
                    </p>
                    <ol className={bem.elem('ul').cls()}>
                        <li className={bem.elem('li').cls()}>
                            Лист повинен бути вид особи яка має право представництва клубу, зазвичай це голова правління чи президент клубу. Якщо клуб для цого виділяє окрему людину то потрібно попередити федерацію окремим листом.
                        </li>
                        <li className={bem.elem('li').cls()}>
                            Заява і документи гравців повинні надходити з пошти (електроної пошти) яку клуб вказав у якості контактних даних або яка вказана на офіційному бланку організації.
                        </li>
                        <li className={bem.elem('li').cls()}>
                            Стосовно отримання чи пролонгації лицензій федерація не має стосунків с гравцями чи тренерами клубів, виключно с офіційнимі особами клубу.
                        </li>
                        <li className={bem.elem('li').cls()}>
                            Якщо клуб надае заяву у електроному вигляді вин повинен бути отсканований (jpeg, png та інші) чи підписаний у форматі PDF. Файли пропрієтарних (платних) версій програм прийматися не будуть (.doc, .docx, .pages та інші). Будь ласка не присилайте ссилання на онлайн версії вашіх файлів, вони не є фіксованими версіями та можуть бути зміненними після подання. (дивітся зразок)
                        </li>
                    </ol>
                    <p className={bem.elem('p').cls()}>
                        Документи і фото
                    </p>
                    <ol className={bem.elem('ul').cls()}>
                        <li className={bem.elem('li').cls()}>
                            Скан документу повинен мати назву яка легко ідентифікує змітст, наприклад "КФК Іван Сірко паспорт" (дивіться зразок).
                        </li>
                        <li className={bem.elem('li').cls()}>
                            Фото потрібно надавати у тому вигляді у якому воно буде в системі, ніхто замість вас не буде оброляти його видаляте заяве чи вирізати його зі скану с документами. Назвати фото потрібно так щоб його було легко ідентификувати, наприклад "КФК Іван Сірко фото" (дивіться зразок).
                        </li>
                        <li className={bem.elem('li').cls()}>
                            Будь ласка, за для вашої безпеки, не кладіть скани документів онлайн. Видправляйте тільки у листі.
                        </li>
                        <li className={bem.elem('li').cls()}>
                            Для архівування документів не використовувайте платних форматів (rar), для цього у будь якій системи є zip.
                        </li>
                    </ol>
                    <p className={bem.elem('p').cls()}>
                        Додаткова інформація
                    </p>
                    <ol className={bem.elem('ul').cls()}>
                        <li className={bem.elem('li').cls()}>
                            Таблиця для додаткової інформації є у зразках, ця інформація не є обов'язковою, але дозволить мати вести статистику та робить картку гравця більш інформативною.
                        </li>
                    </ol>
                    <p className={bem.elem('p').cls()}>
                        Документи та питання надсилати сюди <a href='mailto:license@floorball.org.ua'>license@floorball.org.ua</a>
                    </p>
                </Cell>
            </Grid>
        );
    }
}
