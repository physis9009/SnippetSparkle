import {creatSnippet} from '@/app/lib/actions';
import { supportedLanguages } from '../lib/utils';
import {getCachedTags} from '../lib/server-utils';

export default async function Page() {
    const tags = await getCachedTags();

    return (
        <form action={creatSnippet}>
            <label htmlFor='language'>Choose a language</label>
            <select id="language" name="language">
                {supportedLanguages.map((lan) => (
                    <option key={lan} value={lan}>{lan}</option>
                ))}
            </select>

            <label htmlFor='title'>Title</label>
            <input type="text" id="title" name='title'></input>

            <label htmlFor='code'>Code</label>
            <textarea id='code' name='code' rows={10}></textarea>

            <label htmlFor='summary'>Summary</label>
            <textarea rows={5} id='summary' name='summary'></textarea>

            <label htmlFor='tags'>Tags</label>
            <select id='tags' name='tags' multiple size={5}>
                {tags.map((tag) => (
                    <option key={tag.name} value={tag.name}>
                        {tag.display_name}
                    </option>
                ))}
            </select>

            <label htmlFor='new_tag'>Or add a new tag</label>
            <input type="text" id="new_tag" name="new_tag" placeholder="e.g., 'React Hooks'" />

            <button type="submit">Create Snippet</button>
        </form>
    );
}