import {supabase} from "../supabaseClient";
import _ from 'lodash';

export const get_all_user_languages = async (userid) => {

    const user_lang = {
        "lang_primary": [],
        "lang_secondary": []
    }

    let {data: langs_from_db, error, status} = await supabase
        .from('userlang')
        .select(`langid,isprimary`)
        .eq('userid', userid)
    if (error && status !== 406) throw  error
    if (langs_from_db) {
        for (let lang_from_db of langs_from_db) {
            let {data: language, error, status} = await supabase
                .from('lang')
                .select('lang')
                .eq('id', lang_from_db.langid)
                .single()
            if (error && status !== 406) return error.message
            if (language) {
                if (lang_from_db.isprimary) user_lang.lang_primary.push({
                    "value": lang_from_db.langid,
                    "label": language.lang
                });
                else user_lang.lang_secondary.push({"value": lang_from_db.langid, "label": language.lang})
            }
        }
    }
    return user_lang
}


export const get_all_languages = async () => {
    let {data, error, status} = await supabase
        .from("lang")
        .select(
            `lang,
                    id`
        )
    if (error && status !== 406) return error.message
    if (data) {
        return data.map((lang) => {
            return {
                "value": lang.id,
                "label": lang.lang
            }
        })
    }
}


const delete_all_user_lang = async (userid) => {

    await supabase
        .from('userlang')
        .delete()
        .eq('userid', userid)


}

const insert_lang = async (languages, isprimary, userid) => {
    for (let lang of languages) {
        await supabase
            .from('userlang')
            .insert(
                {
                    'langid': lang.value,
                    userid,
                    isprimary
                }
            )
    }
}

export const updateLanguages = async (lang_primary, lang_secondary, userid) => {
    await delete_all_user_lang(userid)
    await insert_lang(lang_primary, true, userid)
    _.remove(lang_secondary, (lang_sec) => lang_primary.map((lang) => lang.value).indexOf(lang_sec.value) >= 0)
    await insert_lang(lang_secondary, false, userid)
}
