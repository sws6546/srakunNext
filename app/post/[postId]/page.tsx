import { getPostWithComments } from "@/lib/serverActions"
import { notFound } from 'next/navigation'
import { getSession } from '@auth0/nextjs-auth0';
import CommentForm from "@/components/CommentForm";

export default async function Post({ params }: { params: { postId: string } }) {
    const session = await getSession();
    const user = session?.user;

    const postData = await getPostWithComments(params.postId)
    if(postData.length == 0){
        notFound()
    }
    const post = postData[0]
    const comments = postData[0].comments

    return (
        <>
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
            </div>
            {
                user && <CommentForm props={{ postId: params.postId }}/>
            }
            {
                comments.map((comment, id) => (
                    <div key={id} className="w-full md:w-2/3 m-auto flex flex-col bg-cyan-700 rounded-md p-2 gap-2 opacity-80 shadow-xl mt-4">
                        <div className="flex flex-row items-center gap-2 justify-between">
                            <div className="flex flex-row gap-2 items-center">
                                <img src={comment.author_image} alt="img" className="w-8 rounded-full shadow-xl"/>
                                <p className="text-sm">{comment.author}</p>
                            </div>
                            <p className="text-sm">{comment.added_Date.getDate()} {comment.added_Date.getMonth()+1} {comment.added_Date.getFullYear()} {comment.added_Date.getHours()}:{comment.added_Date.getMinutes()}</p>
                        </div>
                        <p className="p-2 bg-cyan-600 rounded-md text-xl font-bold shadow-xl">{comment.content}</p>
                    </div>  
                ))
            }
        </>
    )
}
