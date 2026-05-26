import {creatSnippet} from '@/app/lib/actions';
import { supportedLanguages } from '../lib/utils';
import {getCachedTags} from '../lib/server-utils';

export default async function Page() {
    const tags = await getCachedTags();

    return (
        <form action={creatSnippet} className='w-full bg-blk-md flex flex-col items-center overflow-y-auto custom-scrollbar'>
            <fieldset className='grid grid-cols-4 w-[90%] justify-items-center content-start gap-4 
            border-x-0 border-y-blk-gr border-y-2 rounded-lg mb-4 pb-4'>
                <legend className='col-span-2 col-start-2 py-4 text-center text-2xl'>Create a new snippet</legend>
                <label className='col-start-1 col-span-2'>
                    Language: 
                    <select id="language" name="language" className='bg-blk ml-2 hover:cursor-pointer rounded-sm hover:shadow-blk-gr hover:shadow'>
                        {supportedLanguages.map((lan) => (
                            <option key={lan} value={lan}>{lan}</option>
                        ))}
                    </select>
                </label>

                <label className='col-start-3 col-span-2'>
                    Title: 
                    <input type="text" id="title" name='title' className='bg-blk ml-2 rounded-sm hover:shadow-blk-gr hover:shadow' placeholder='optional'></input>
                </label>

                
                <textarea id='code' name='code' rows={10} className='bg-blk col-start-1 col-span-4 w-[90%] rounded-sm hover:shadow-blk-gr hover:shadow' placeholder='Paste your code here... (required)'></textarea>
                
                <textarea rows={5} id='summary' name='summary' className='bg-blk col-start-1 col-span-4 w-[90%] rounded-sm hover:shadow-blk-gr hover:shadow' placeholder='Add a brief summary of your snippet... (optional)'></textarea>
                

                <div className="col-start-1 col-span-4 grid grid-cols-4 gap-2">
                    Tags: 
                    {tags.map((tag) => (
                        <label key={tag.name} className="flex items-center gap-2 hover:cursor-pointer">
                        <input type="checkbox" name="tags" value={tag.name} className='bg-blk hover:cursor-pointer text-wht-gr hover:text-wht'/>
                            {tag.display_name}
                        </label>
                    ))}
                </div>

                <label className='col-start-1 col-span-2'>
                    Or add a new tag: 
                    <input type="text" id="new_tag" name="new_tag" placeholder="optional" className='bg-blk ml-2 rounded-sm hover:shadow-blk-gr hover:shadow'/>
                </label>
            </fieldset>

            <button type="submit" className='bg-grn-gr hover:bg-grn rounded-sm p-1 hover:cursor-pointer'>Submit</button>
            
        </form>
    );
}