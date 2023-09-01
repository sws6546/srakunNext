'use client'

import { getTenPosts, addPost, getNewestPost } from "@/lib/serverActions"
import { useEffect, useRef, useState } from "react"
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link'

type Post = {
    id: string;
    added_Date: Date;
    title: string;
    content: string;
    author: string;
    author_image: string;
    _count: { comments: number }
}

export default function Home() {
    const [latestPostDate, setLatestPostdate] = useState(new Date)
    const [posts, setPosts] = useState<Post[]>([])
    const [errMsg, setErrMsg] = useState<string>("")
    const { user, error, isLoading } = useUser();
    const ref = useRef<HTMLFormElement>(null)

    const loadPosts = async () => {
        const [ newPosts, lastDate ] = await getTenPosts(latestPostDate)
        setLatestPostdate(lastDate as Date)
        setPosts([...posts, ...newPosts as Post[]])
    }

    const loadFormForLoggedUsers = () => {
        if(!isLoading && user){
            return (
                <form ref={ref} action={ async formData => {
                    let ok = true
                    setErrMsg("")
                    if(formData.get('title') == ""){
                        setErrMsg("Pole Tytułu jest puste")
                        ok = false
                    }
                    if(formData.get('content') == ""){
                        setErrMsg("Pole Treści jest puste")
                        ok = false
                    }
                    if(ok){
                        const res = await addPost(formData)
                        if(res.err){
                            setErrMsg(res.err)
                        }else{
                            ref.current?.reset()
                            const newPost: Post[] = await getNewestPost()
                            setPosts(oldPosts => [newPost[0], ...oldPosts])
                        }
                    }
                }
                } className="m-auto flex flex-col gap-4 w-full md:w-2/3 rounded-md bg-cyan-700 p-4 shadow-xl opacity-80">
                    <label htmlFor="title" className="mb-[-16px]">Tytuł</label>
                    <input type="text" id="title" name="title" placeholder="eg. TytÓł" 
                    className="p-2 bg-cyan-50 hover:bg-cyan-200 transition shadow-xl rounded-md focus:bg-cyan-200 text-cyan-900"/>

                    <label htmlFor="content" className="mb-[-16px]">Treść</label>
                    <textarea name="content" id="content" rows={3} placeholder="Napisz coś"
                    className="p-2 bg-cyan-50 hover:bg-cyan-200 transition shadow-xl rounded-md focus:bg-cyan-200 text-cyan-900"/>
                    
                    {errMsg}
                    <input type="submit" value="Dodaj post" className="cursor-pointer p-2 bg-cyan-600 rounded-md hover:bg-cyan-800 shadow-xl transition" />
                </form>
            )
        }
        else{
            return ("")
        }
    }

    useEffect(() => { loadPosts() },[])

    if (error) return <div>{error.message}</div>;

    return (
        <div className="text-cyan-300 flex flex-col gap-4">
            { loadFormForLoggedUsers() }
            {
                posts.map((post: Post, id: number) => (
                    <Link key={id} href={`/post/${post.id}`}>
                        <div className="w-full md:w-2/3 m-auto flex flex-col bg-cyan-700 rounded-md p-2 gap-2 opacity-80 shadow-xl">
                            <p className="p-2 bg-cyan-600 rounded-md text-xl font-bold shadow-xl">{post.title}</p>
                            <div className="flex flex-row items-center gap-2 justify-between">
                                <div className="flex flex-row gap-2 items-center">
                                    <img src={post.author_image} alt="img" className="w-8 rounded-full shadow-xl"/>
                                    <p className="text-sm">{post.author}</p>
                                </div>
                                <p className="text-sm">{post.added_Date.getDate()} {post.added_Date.getMonth()+1} {post.added_Date.getFullYear()} {post.added_Date.getHours()}:{post.added_Date.getMinutes()}</p>
                            </div>
                            <div className="p-2 rounded-md bg-cyan-800 text-xl shadow-xl">
                                {post.content}
                            </div>
                            <p className="m-auto text-sm">komentarze ({post._count.comments})</p>
                        </div>
                    </Link>
                ))
            }
            <button onClick={() => {loadPosts()}}>load posts</button>
        </div>
    )
}
