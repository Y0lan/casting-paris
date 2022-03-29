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

const deleteTags = async (userid) => {
    await supabase
        .from('usertags')
        .delete()
        .eq("userid", userid)
}

const insertTag = async (tag, userid) => {
    let tagid = tag.value
    if (!await doesTagExist(tag)) {
        tagid = await createTag(tag)
    }
    await supabase
        .from('usertags')
        .insert({
            tagid,
            userid
        })
}

const createTag = async (tag) => {
    const {data: newTag} = await supabase
        .from('tags')
        .insert(
            {tagname: tag.label}
        )
        .single()
    return newTag.id
}

const doesTagExist = async (tag) => {
    const {data: foundTag} = await supabase
        .from('tags')
        .select('tagname')
        .eq('tagname', tag.label)
    return foundTag.length > 0
}

export const updateTags = async (tags, userid) => {
    await deleteTags(userid)
    tags = tags === undefined ? [] : tags
    for (const tag of tags) {
        await insertTag(tag, userid)
    }
}
