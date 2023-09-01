'use server'

import { PrismaClient } from "@prisma/client"
import { getSession } from '@auth0/nextjs-auth0';
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient()

export async function getTenPosts( lastPost: Date ){    
    
    let posts = await prisma.post.findMany({
        take: 15,
        where: {
            added_Date: {
                lt: lastPost
            }
        },
        orderBy: {
            added_Date: 'desc'
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })        

    if(posts.length == 0){
        return [posts, lastPost]
    }else{
        return [posts, posts[posts.length - 1].added_Date]
    }
}

export async function getNewestPost(){
    const post = await prisma.post.findMany({
        take: 1,
        orderBy: {
            added_Date: 'desc'
        },
        include: {
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    return post
}

export async function addPost( formData: FormData ){
    const session = await getSession();
    const user = session?.user;

    if(!user){
        return {err: "There's no user logged"}
    }

    const title: string = `${formData.get('title')}`
    const content: string = `${formData.get('content')}`

    if(title == "" || content == ""){
        return {err: "There's no title or content"}
    }

    // TODO: check time of last user post, for protect before spam

    const lastUserPost = await prisma.post.findMany({
        take: 1,
        where: {
            author: user.name,
        },
        orderBy: {
            added_Date: 'desc'
        }
    })

    if(lastUserPost.length != 0){
        let dateNow = new Date
        if(dateNow.getTime() - lastUserPost[0].added_Date.getTime() < 120001){
            return {err: "Wait"}
        }
    }

    const addedPost = await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: user.name,
            author_image: user.picture
        }
    })

    return {res: "added"}
}

export async function getPostWithComments(id: string){
    const post = prisma.post.findMany({
        take: 1,
        where: {
            id: id,
        },
        include: {
            comments: true
        }
    })
    return post
}

export async function addComment([formData, id]: [FormData, string]){
    const session = await getSession();
    const user = session?.user;

    if(!user){
        return {err: "There's no user logged"}
    }

    const content: string = `${formData.get('content')}`
    if(content == ""){
        return {err: "There's no content"}
    }

    if((await getPostWithComments(id)).length == 0){
        return {err: "There's no post"}
    }

    const lastUserComment = await prisma.comment.findMany({
        take: 1,
        orderBy: {
            added_Date: 'desc'
        },
        where: {
            author: user.name
        }
    })
    if(lastUserComment.length != 0){
        let newDate: Date = new Date
        if(newDate.getTime() - lastUserComment[0].added_Date.getTime() < 120001){
            return {err: "Wait"}
        }
    }

    const comment = prisma.comment.create({
        data: {
            content: content,
            author: user.name,
            author_image: user.picture,
            postId: id
        }
    })

    return {res: comment}
}