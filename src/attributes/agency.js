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
