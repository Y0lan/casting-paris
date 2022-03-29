import {supabase} from "../supabaseClient";

export const get_all_user_agency = async (userid) => {
    const agencies = []
    let {data: agenciesid, error, status} = await supabase
        .from('usersagency')
        .select('agencyid')
        .eq('userid', userid)
    if (error && status !== 406) throw  error
    if (agenciesid) {
        for (let {agencyid} of agenciesid) {
            let {data: agency, error, status} = await supabase
                .from('agency')
                .select('name')
                .eq('id', agencyid)
                .single()

            if (error && status !== 406) return error
            if (agency) {
                agencies.push({"value": agencyid, "label": agency.name});
            }
        }
    }
    return agencies
}

export const get_all_agencies = async () => {
    let {data, error, status} = await supabase
        .from("agency")
        .select(
            `name,
                    id`
        )
    if (error && status !== 406) return error
    if (data) {
        return data.map((agency) => {
            return {
                "label": agency.name,
                "value": agency.id
            }
        })
    }
}

const deleteAgencies = async (userid) => {
    await supabase
        .from('usersagency')
        .delete()
        .eq("userid", userid)
}

const insertAgency = async (agency, userid) => {
    let agencyid = agency.value
    if (!await doesAgencyExist(agency)) {
        agencyid = await createAgency(agency)
    }
    await supabase
        .from('usersagency')
        .insert({
            agencyid,
            userid
        })
}

const createAgency = async (agency) => {
    const {data: newAgency} = await supabase
        .from('agency')
        .insert(
            {name: agency.label}
        )
        .single()
    return newAgency.id
}

const doesAgencyExist = async (agency) => {
    const {data: foundAgency} = await supabase
        .from('agency')
        .select('name')
        .eq('name', agency.label)
    return foundAgency.length > 0
}

export const updateAgencies = async (agencies, userid) => {
    await deleteAgencies(userid)
    agencies = agencies === undefined ? [] : agencies
    for (const agency of agencies) {
        await insertAgency(agency, userid)
    }
}
