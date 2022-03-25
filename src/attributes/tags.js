import {supabase} from "../supabaseClient";

export const get_all_user_tags = async (userid) => {
    const tags = []
    let {data: tagsids, error, status} = await supabase
        .from('usertags')
        .select('tagid')
        .eq('userid', userid)
    if (error && status !== 406) throw  error
    if (tagsids) {
        for (let {tagid} of tagsids) {
            let {data: tag, error, status} = await supabase
                .from('tags')
                .select('tagname')
                .eq('id', tagid)
                .single()
            if (error && status !== 406) return error
            if (tag) {
                tags.push({"value": tagid, "label": tag.tagname});
            }
        }
    }
    return tags
}


export const get_all_tags = async () => {
    let {data, error, status} = await supabase
        .from("tags")
        .select(
            `tagname,
                    id`
        )
    if (error && status !== 406) return error
    if (data) {
        return data.map((tag) => {
            return {
                "label": tag.tagname,
                "value": tag.id
            }
        })
    }
}
