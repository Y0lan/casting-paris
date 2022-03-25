/*
    Base
 */

import {get_gender_choice} from "./gender_choice";
import {get_skin_color_choice} from "./skin_color_choice";
import {get_hair_color_choice} from "./hair_color_choice";
import {all_cities} from "./cities";
import {get_all_agencies, get_all_user_agency} from "./agency";
import {get_all_tags, get_all_user_tags} from "./tags";
import {get_all_languages, get_all_user_languages} from "./lang";
import {supabase} from "../supabaseClient";
import moment from "moment-timezone";

export const get_user_info = async (userid) => {
    let {data, error, status} = await supabase
        .from('users')
        .select(
            `name,
                     surname,
                     birthdate,
                     insta,
                     facebook,
                     jacket_size,
                     trouser_size,
                     chest_size,
                     waist_size,
                     hip_size,
                     shoe_size,
                     eyes_color,
                     details,
                     height,
                     phone,
                     email,
                     skin_color,
                     hair_color,
                     locations,
                     gender,
                     last_updated
                     `)
        .eq('id', userid)
        .single();
    if (error && status !== 406) return error.message
    return data
}


export const getAttributes = async (userid) => {
    let user = await get_user_info(userid)

    const agencies_choice = await get_all_agencies()
    const tags_choice = await get_all_tags()
    const all_lang_choice = await get_all_languages()
    const {lang_primary, lang_secondary} = await get_all_user_languages(userid)

    return {
        "name": user.name,
        "surname": user.surname,
        "birthdate": user.birthdate,
        "insta": user.insta,
        "facebook": user.facebook,
        "jacket_size": user.jacket_size,
        "trouser_size": user.trouser_size,
        "chest_size": user.chest_size,
        "waist_size": user.waist_size,
        "hip_size": user.hip_size,
        "shoe_size": user.shoe_size,
        "eyes_color": user.eyes_color,
        "details": user.details,
        "height": user.height,
        "phone": user.phone,
        "email": user.email,
        "gender": user.gender,
        "gender_choice": get_gender_choice(),
        "last_updated": moment(user.last_updated).tz("europe/paris").format("yyyy-mm-dd hh:mm:ss"),
        "skin_color": user.skin_color,
        "skin_color_choice": get_skin_color_choice(),
        "hair_color": null,
        "hair_color_choice": get_hair_color_choice(),
        "agencies": await get_all_user_agency(userid),
        "agencies_choice": agencies_choice,
        "countries": [],
        "cities": [],
        "all_cities": all_cities,
        "locations": [],
        "all_lang_choice": all_lang_choice,
        "lang_primary": lang_primary,
        "lang_secondary": lang_secondary,
        "tags": await get_all_user_tags(userid),
        "tags_choice": tags_choice,
        accept_body_modification: false,
        accept_nude: false,
        accept_figuration: false,
    }
}
