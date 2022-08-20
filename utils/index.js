import axios from "axios"

export const loadPosts = async () => {
    const res = await axios('https://storage.googleapis.com/simple-git-test.appspot.com/blogData.txt');
    return res.data;
}
