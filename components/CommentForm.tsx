'use client'

import { addComment } from '@/lib/serverActions'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function CommentForm({ props }: { props: { postId: string }}) {
    const [errMsg, setErrMsg] = useState<string>("")
    const ref = useRef<HTMLFormElement>(null)
    const router = useRouter()

    return (
        <form ref={ref} action={async formData => {
            let ok = true
            setErrMsg("")

            if(formData.get('content') == ""){
                setErrMsg("Pole Treści jest puste")
                ok = false
            }

            if(ok){
                const res = await addComment([formData, props.postId])
                if(res.err){
                    setErrMsg(res.err)
                }else{
                    ref.current?.reset()
                    router.refresh()
                }
            }
        }} className="m-auto flex flex-col gap-4 w-full md:w-2/3 rounded-md bg-cyan-700 p-4 shadow-xl opacity-80 mt-4">
            <label htmlFor="content" className="mb-[-16px]">Komentarz</label>
            <input type="text" id="content" name="content" placeholder="eg. Świetny post!!!" 
            className="p-2 bg-cyan-50 hover:bg-cyan-200 transition shadow-xl rounded-md focus:bg-cyan-200 text-cyan-900"/>

            {errMsg}
            <input type="submit" value="Dodaj Komentarz" className="cursor-pointer p-2 bg-cyan-600 rounded-md hover:bg-cyan-800 shadow-xl transition" />
        </form>
    )
}