<script>
    import {supabase} from "./supabaseClient";
    import {user} from "./sessionStore";
    import moment from "moment";
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
    let agencies_choice = [];
    let agencies = [];
    $: if (agencies === undefined) { agencies = []; }
    let phone = null;
    let email = null;
    let last_seen = null;
    let gender = "no answer";
    const gender_choice = ["male", "female", "other", "no answer"]
    let skin_color = "other";
    const skin_color_choice = ["black", "white", "mixed", "others"].sort()
    let hair_color = "other"
    const hair_color_choice = ["black", "brown", "blonde", "red", "blue", "purple", "pink", "others"].sort()
    $: countries = ["Angola"] ;
    $: if (countries === undefined) { countries = []; }
    let all_cities = [{}];
    $: cities_filtered = [].concat.apply([], all_cities.map(a => countries.map(k => a[k["value"]]))[0]).sort();
    let cities = [];
    $: if (cities === undefined) { cities = []; }
    $: all_countries = []
    let accept_body_modification = false;
    let accept_nude = false;
    let accept_figuration = false;
    let lang = "FR"
    let tags = [];



    async function getProfile() {

        const json = await fetch(COUNTRIES_NOW_URL)
            .then(response => response.json())
            .then(json => json["data"]);

        for (let country in json) {
            const country_name = json[country]["country"];
            all_countries.push(country_name)
            all_cities[0][country_name] = json[country]["cities"]
        }

        try {
            let {data, error, status} = await supabase
                .from("agency")
                .select(
                    `name,
                    id`
                )
            if (error && status !== 406) throw error
            if(data) {
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


        try {
            loading = true;
            const user = supabase.auth.user();
            last_seen = user.last_sign_in_at

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
                 agency,
                 phone,
                 email,
                 skin_color,
                 hair_color,
                 countries,
                 cities,
                 lang,
                 gender,
                 tags
                 `)
                .eq('id', user.id)
                .single()


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
                details = data.details;
                height = data.height;
                agencies = data.agency;
                phone = data.phone;
                email = data.email;
                skin_color = data.skin_color,
                hair_color = data.hair_color,
                countries = data.countries,
                cities = data.cities,
                lang = data.lang,
                gender = data.gender,
                tags = data.tags
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
            last_seen = user.last_sign_in_at
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
                agency: agencies,
                phone,
                skin_color,
                hair_color,
                countries,
                cities,
                lang,
                gender,
                tags
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
        <input id="last_casting" type="text" value={moment(last_seen).format('MM/DD/yyyy, HH:mm:ss')} disabled>
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
