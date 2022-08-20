import axios from "axios"

export const fetcher = async (
    resource,
    init,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => {
    const res = await fetch(resource, init)

    if (!res.ok) {
        const errorRes = await res.json()
        const error = new Error(
            errorRes.message ?? 'APIリクエスト中にエラーが発生しました',
        )

        throw error
    }

    return res.json()
}

export const loadPosts = async () => {
    const res = await axios('https://storage.googleapis.com/simple-git-test.appspot.com/blogData.txt');
    // console.log("util.loadPsts:", res);
    return res.data;
}
