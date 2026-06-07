'use client';

import {creatSnippet} from '@/app/lib/actions';
import { supportedLanguages } from '@/app/lib/utils';
import { useActionState } from 'react';
import { MorphingInfinity } from '@/components/morphing-infinity';
import { FormState } from '@/app/lib/actions';

export function NewSnippetForm({tags}: {tags: {
    name: string;
    display_name: string;
}[]}) {
    const [formState, formAction, isPending] = useActionState<FormState, FormData>(creatSnippet, {success: false, errors: null, message: null});

    return (
        <form action={formAction} className='w-full bg-blk-md flex flex-col items-center overflow-y-auto custom-scrollbar'>
            <fieldset className='grid grid-cols-4 w-[90%] justify-items-center content-start gap-4 
            border-x-0 border-y-blk-gr border-y-2 rounded-lg mb-4 pb-4'>
                <legend className='col-span-2 col-start-2 py-4 text-center text-2xl'>Create a new snippet</legend>
                <label className='col-start-1 col-span-2'>
                    Language: 
                    <select 
                        id="language" name="language"
                        className='bg-blk ml-2 hover:cursor-pointer rounded-sm hover:shadow-blk-gr hover:shadow'
                        aria-describedby='langauge-error'
                        defaultValue=""
                    >
                        <option disabled value=''>--Select--</option>
                        {supportedLanguages.map((lan) => (
                            <option key={lan} value={lan}>{lan}</option>
                        ))}
                    </select>
                </label>

                <label className='col-start-3 col-span-2'>
                    Title: 
                    <input 
                        type="text" id="title" name='title' 
                        className='bg-blk ml-2 rounded-sm hover:shadow-blk-gr hover:shadow' placeholder='optional'
                        aria-describedby='title-error'
                    ></input>
                </label>

                <div id='language-error' className='col-span-2 col-start-1 text-xs text-pnk' aria-live='polite' aria-atomic='true'>
                    {formState.errors?.language && formState.errors.language.map((error) => <span key={error}>{error}</span>)}
                </div>
                <div id='title-error' className='col-span-2 col-start-3 text-xs text-pnk' aria-live='polite' aria-atomic='true'>
                    {formState.errors?.title && formState.errors.title.map((error) => <span key={error}>{error}</span>)}
                </div>
                
                <textarea 
                    id='code' name='code' rows={10} 
                    className='bg-blk col-start-1 col-span-4 w-[90%] rounded-sm hover:shadow-blk-gr hover:shadow' placeholder='Paste your code here... (required)'
                    aria-describedby='code-error'
                ></textarea>

                <div id='code-error' className='col-span-4 col-start-1 text-xs text-pnk' aria-live='polite' aria-atomic='true'>
                    {formState.errors?.code && formState.errors.code.map((error) => <span key={error}>{error}</span>)}
                </div>
                
                <textarea 
                    rows={5} id='summary' name='summary' 
                    className='bg-blk col-start-1 col-span-4 w-[90%] rounded-sm hover:shadow-blk-gr hover:shadow' placeholder='Add a brief summary of your snippet... (optional)'
                    aria-describedby='summary-error'
                ></textarea>
                
                <div id='summary-error' className='col-span-4 col-start-1 text-xs text-pnk' aria-live='polite' aria-atomic='true'>
                    {formState.errors?.summary && formState.errors.summary.map((error) => <span key={error}>{error}</span>)}
                </div>

                <div className="col-start-1 col-span-4 grid grid-cols-1 gap-2 items-start w-[90%]" aria-describedby='tags-error'>
                    <span>Tags: </span>
                    <div className='flex flex-row flex-wrap gap-4 overflow-y-auto px-4 py-2 max-h-[30vh] custom-scrollbar bg-blk rounded-sm'>
                        {tags.map((tag) => (
                            <div key={tag.name} className='bg-blk-md hover:bg-blk-gr rounded-sm px-2'>
                                <label className="flex items-center gap-2 hover:cursor-pointer">
                                <input type="checkbox" name="tags" value={tag.name} className='bg-blk hover:cursor-pointer text-wht-gr hover:text-wht'/>
                                    {tag.display_name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div id='tags-error' className='col-span-4 col-start-1 text-xs text-pnk' aria-live='polite' aria-atomic='true'>
                    {formState.errors?.tags && formState.errors.tags.map((error) => <span key={error}>{error}</span>)}
                </div>

                <label className='col-start-1 col-span-2'>
                    Or add a new tag: 
                    <input type="text" id="new_tag" name="new_tag" placeholder="optional" className='ml-4 bg-blk rounded-sm hover:shadow-blk-gr hover:shadow'/>
                </label>
            </fieldset>

            {isPending
                ? <MorphingInfinity />
                : <button type="submit" className='bg-grn-gr hover:bg-grn rounded-sm p-1 hover:cursor-pointer' aria-describedby='submit-error'>Submit</button>
            }

            <div id='submit-error' className='col-span-4 col-start-1 text-xs text-pnk' aria-live='polite' aria-atomic='true'>
                {formState.message && <p className="text-pnk text-xs">{formState.message}</p>}
            </div>
        </form>
    );
}