import {creatSnippet} from '@/app/lib/actions';
import { supportedLanguage } from '../lib/definitions';

export default async function Page() {
    return (
        <form action={creatSnippet}>
            <label htmlFor='language'>Choose a language</label>
            <select id="language" name="language" defaultValue="">
                {supportedLanguage.map((lan) => (
                    <option key={lan} value={lan}>{lan}</option>
                ))}
            </select>
            <label htmlFor='title'>Title</label>
            <input type="text" id="title" name='title'></input>
            <label htmlFor='author'>author</label>
            <input id='author' name='author' type='text'></input>
            <label htmlFor='code'>Code</label>
            <textarea id='code' name='code' rows={10}></textarea>
            <label htmlFor='summary'>Summary</label>
            <textarea rows={5} id='summary' name='summary'></textarea>
            <label htmlFor='tags'>Tags</label>
            <select id='tags' name='tags' defaultValue="">
                {}
            </select>
        </form>
    );
}