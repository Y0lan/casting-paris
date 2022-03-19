<script>
    import {supabase} from "./supabaseClient";
    import {user} from "./sessionStore";
    import moment, {now} from "moment";
    import Select from 'svelte-select';

    const COUNTRIES_NOW_URL = "https://countriesnow.space/api/v0.1/countries"

    let loading = true;
    let name = null;
    let surname = null;
    let birthdate = null;
    let insta = null;
    let facebook = null;
    let jacket_size = null;
    let trouser_size = null;
    let chest_size = null;
    let waist_size = null;
    let hip_size = null;
    let shoe_size = null;
    let eyes_color = null;
    let details = null;
    let height = null;
    let last_updated = null;
    $: console.log("last updated: ", last_updated)
    let agencies_choice = [];
    let agencies = [];
    $: if (agencies === undefined) {
        agencies = [];
    }
    let phone = null;
    let email = null;
    const gender_choice = ["male", "female", "other", "no answer"]
    let gender = null;
    $: if (gender !== null) {
        gender = gender.value ? gender.value : gender;
    }
    const skin_color_choice = ["black", "white", "mixed", "others"].sort()
    let skin_color = null
    $: if (skin_color !== null) {
        skin_color = skin_color.value ? skin_color.value : skin_color;
    }
    const hair_color_choice = ["black", "brown", "blonde", "red", "blue", "purple", "pink", "others"].sort()
    let hair_color = hair_color_choice[0]
    $: if (hair_color !== null) {
        hair_color = hair_color.value ? hair_color.value : hair_color;
    }

    let countries = [];
    $: all_countries = []
    $: if (countries === undefined || countries === null) {
        countries = [];
    } else {
        countries = countries.map((country) => country.value ? country.value : country)
    }

    let cities = [];
    let all_cities = [{}];
    $: cities_filtered = [].concat.apply([], all_cities.map(a => countries.map(k => a[k]))[0]).sort();
    $: if (cities === undefined || cities === null) {
        cities = [];
    } else {
        cities = cities.map((city) => city.value ? city.value : city)
    }

    let accept_body_modification = false;
    let accept_nude = false;
    let accept_figuration = false;

    const doesExist = (obj, value) => {
        for (let items of obj) {
            if (items["label"] === value) {
                return true
            }
        }
        return false
    }




    let all_lang_choice = []
    $: lang_primary = []
    $: lang_secondary = []

    $: if (lang_primary === undefined || lang_primary === null) lang_primary = []

    $: if (lang_secondary === undefined || lang_secondary === null) lang_secondary = []


    let tags = [];
    let tags_choice = [];

    async function getProfile() {

        const user = supabase.auth.user();
        const json = await fetch(COUNTRIES_NOW_URL)
            .then(response => response.json())
            .then(json => json["data"]);

        for (let country in json) {
            const country_name = json[country]["country"];
            all_countries.push(country_name)
            all_cities[0][country_name] = json[country]["cities"]
        }


        // agencies
        // get agencies of current user
        try {
            let {data: agenciesid, error, status} = await supabase
                .from('usersagency')
                .select('agencyid')
                .eq('userid', user.id)
            if (error && status !== 406) throw  error
            if (agenciesid) {
                for (let {agencyid} of agenciesid) {
                    let {data: agency, error, status} = await supabase
                        .from('agency')
                        .select('name')
                        .eq('id', agencyid)
                        .single()

                    if (error && status !== 406) throw error
                    if (agency) {
                        agencies.push({"value": agencyid, "label": agency.name});
                    }
                }
            }
        } catch (error) {
            alert(error.message)
        }

        // get all agencies name for choice
        try {
            let {data, error, status} = await supabase
                .from("agency")
                .select(
                    `name,
                    id`
                )
            if (error && status !== 406) throw error
            if (data) {
                agencies_choice = data.map((agency) => {
                    return {
                        "label": agency.name,
                        "value": agency.id
                    }
                })
            }
        } catch (error) {
            alert(error.message)
        }
        // tags
        // get tags of current user
        try {
            let {data: tagsids, error, status} = await supabase
                .from('usertags')
                .select('tagid')
                .eq('userid', user.id)
            if (error && status !== 406) throw  error
            if (tagsids) {
                for (let {tagid} of tagsids) {
                    let {data: tag, error, status} = await supabase
                        .from('tags')
                        .select('tagname')
                        .eq('id', tagid)
                        .single()
                    if (error && status !== 406) throw error
                    if (tag) {
                        tags.push({"value": tagid, "label": tag.tagname});
                    }
                }
            }
        } catch (error) {
            alert(error.message)
        }

        // get all tags name
        try {
            let {data, error, status} = await supabase
                .from("tags")
                .select(
                    `tagname,
                    id`
                )
            if (error && status !== 406) throw error
            if (data) {
                tags_choice = data.map((tag) => {
                    return {
                        "label": tag.tagname,
                        "value": tag.id
                    }
                })
            }
        } catch (error) {
            alert(error.message)
        }

        // lang
        // get langs of current user
        try {
            let {data: langs_from_db, error, status} = await supabase
                .from('userlang')
                .select(`langid,isprimary`)
                .eq('userid', user.id)
            if (error && status !== 406) throw  error
            if (langs_from_db) {
                for (let lang_from_db of langs_from_db) {
                    let {data: language, error, status} = await supabase
                        .from('lang')
                        .select('lang')
                        .eq('id', lang_from_db.langid)
                        .single()
                    if (error && status !== 406) throw error
                    if (language) {
                        if (lang_from_db.isprimary) lang_primary.push({
                            "value": lang_from_db.langid,
                            "label": language.lang
                        });
                        else lang_secondary.push({"value": lang_from_db.langid, "label": language.lang})
                    }
                }
            }
        } catch (error) {
            alert(error.message)
        }

        // get all langs name
        try {
            let {data, error, status} = await supabase
                .from("lang")
                .select(
                    `lang,
                    id`
                )
            if (error && status !== 406) throw error
            if (data) {
                all_lang_choice = data.map((lang) => {
                    return {
                        "value": lang.id,
                        "label": lang.lang
                    }
                })
            }
        } catch (error) {
            alert(error.message)
        }

        try {
            loading = true;

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
                     countries,
                     cities,
                     gender,
                     last_updated
                     `)
                .eq('id', user.id)
                .single();


            if (error && status !== 406) throw error

            if (data) {
                name = data.name;
                surname = data.surname;
                birthdate = data.birthdate;
                insta = data.insta;
                facebook = data.facebook;
                jacket_size = data.jacket_size;
                trouser_size = data.trouser_size;
                chest_size = data.chest_size;
                waist_size = data.waist_size;
                hip_size = data.hip_size;
                shoe_size = data.shoe_size;
                eyes_color = data.eyes_color;
                details = data.details
                height = data.height;
                phone = data.phone;
                email = data.email;
                skin_color = data.skin_color;
                hair_color = data.hair_color;
                countries = data.countries;
                cities = data.cities;
                gender = data.gender;
                last_updated = data.last_updated;
            }
        } catch (error) {
            alert(error.message)
        } finally {
            loading = false
        }
    }

    async function updateProfile() {
        try {
            loading = true
            const user = supabase.auth.user();
            const updates = {
                id: user.id,
                email: user.email,
                name,
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
                skin_color,
                hair_color,
                countries,
                cities,
                gender,
                last_updated : moment().format("yyyy-MM-DD HH:mm:ss")
            }

            let {error} = await supabase.from('users').upsert(updates,
                {
                    returning: 'minimal'
                })
            if (error) throw error



        } catch (error) {
            alert(error.message)
        } finally {
            loading = false
        }
    }

    async function signOut() {
        try {
            loading = true
            let {error} = await supabase.auth.signOut();
            if (error) throw error
        } catch (error) {
            alert(error.message)
        } finally {
            loading = false
        }
    }

</script>

<form use:getProfile class="form-widget" on:submit|preventDefault={updateProfile}>
    <div>
        <label for="email">Email</label>
        <input id="email" type="text" value={$user.email} disabled/>
    </div>
    <div>
        <label for="last_casting">Last seen</label>
        <input id="last_casting" type="text" value={moment(last_updated).tz('Europe/Paris').format('yyyy-MM-DD HH:MM:ss')} disabled>
    </div>
    <div>
        <label for="name">Name (required)</label>
        <input
                id="name"
                type="text"
                required
                bind:value={name}
        />
    </div>
    <div>
        <label for="surname">Surname (required)</label>
        <input
                id="surname"
                type="text"
                required
                bind:value={surname}
        />
    </div>
    <div>
        <label for="birthdate">Date of Birth (required)</label>
        <input
                id="birthdate"
                type="date"
                required
                bind:value={birthdate}
        />
    </div>
    <div>
        <label>Gender (required)</label>
        <Select
                id="gender"
                isSearchable="{false}"
                items="{gender_choice}"
                bind:value={gender}/>
    </div>
    <div>
        <label>Hair Color (required)</label>
        <Select
                id="hair_color"
                isSearchable="{false}"
                items="{hair_color_choice}"
                bind:value={hair_color}/>
    </div>
    <div>
        <label>Skin Color (required)</label>
        <Select
                id="skin_color"
                isSearchable="{false}"
                items="{skin_color_choice}"
                bind:value={skin_color}/>
    </div>
    <div>
        <label for="height">Height in cm (required)</label>
        <input
                id="height"
                type="number"
                required
                bind:value={height}
        />
    </div>


    <div>
        <label>Agency (required)</label>
        <Select id="agency" isMulti=true items={agencies_choice} bind:value={agencies}/>
    </div>
    <div>
        <label>Lang fluent (primary) (required)</label>
        <Select id="lang"
                isMulti=true
                items={all_lang_choice}
                bind:value={lang_primary}/>
    </div>
    <div>
        <label>Lang (secondary) (required)</label>
        <Select id="lang"
                isMulti=true
                items={all_lang_choice}
                bind:value={lang_secondary}/>
    </div>
    <div>
        <label>Tags (required)</label>
        <Select id="tags" isMulti=true items={tags_choice} bind:value={tags}/>
    </div>
    <div>
        <label>Country (required)</label>
        <Select id="countries"
                isRequired
                isClearable={false}
                isMulti=true
                items={all_countries}
                bind:value={countries}
        />
    </div>

    <div>
        <label>Cities (required)</label>
        <Select id="cities"
                isVirtualList="{true}"
                isMulti=true items={cities_filtered} bind:value={cities}/>
    </div>
    <div>
        <label for="phone">Phone (required)</label>
        <input
                id="phone"
                type="tel"
                required
                bind:value={phone}
        />
    </div>

    <div>
        <label for="insta">Instagram</label>
        <input
                id="insta"
                type="text"
                bind:value={insta}
        />
    </div>
    <div>
        <label for="facebook">Facebook</label>
        <input
                id="facebook"
                type="text"
                bind:value={facebook}
        />
    </div>
    <div>
        <label for="jacket_size">Jacket size</label>
        <input
                id="jacket_size"
                type="number"
                bind:value={jacket_size}
        />
    </div>
    <div>
        <label for="trouser_size">Trouser size</label>
        <input
                id="trouser_size"
                type="number"
                bind:value={trouser_size}
        />
    </div>
    <div>
        <label for="chest_size">Chest size in cm</label>
        <input
                id="chest_size"
                type="number"
                bind:value={chest_size}
        />
    </div>
    <div>
        <label for="waist_size">Waist size in cm</label>
        <input
                id="waist_size"
                type="number"
                bind:value={waist_size}
        />
    </div>
    <div>
        <label for="hip_size">Hip size in cm</label>
        <input
                id="hip_size"
                type="number"
                bind:value={hip_size}
        />
    </div>
    <div>
        <label for="shoe_size">Shoe size</label>
        <input
                id="shoe_size"
                type="number"
                bind:value={shoe_size}
        />
    </div>
    <div>
        <label for="eyes_color">Eyes color</label>
        <input
                id="eyes_color"
                type="text"
                bind:value={eyes_color}
        />
    </div>
    <div>
        <label for="details">Details</label>
        <input
                id="details"
                type="text"
                bind:value={details}/>
    </div>

    <div>
        <input type="submit" class="button block primary" value={loading ? 'Loading ...' : 'Confirm'}
               disabled={loading}/>
    </div>


</form>
<form style="margin-top: 10px">
    <div>
        <button class="button block" on:click={signOut} disabled={loading}>
            Sign Out
        </button>
    </div>
</form>
