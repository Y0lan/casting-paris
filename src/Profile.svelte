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
    let agency = null;
    let phone = null;
    let email = null;
    let last_seen = null;
    let gender = null;
    let skin_color = null;
    let hair_color = null;
    $: countries = [];
    let all_cities = [{}];
    $: cities_filtered = [].concat.apply([], all_cities.map(a => countries.map(k => a[k["value"]]))[0]);
    let cities = [];
    let all_countries = []


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
                 email
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
                details = data.details
                ;
                height = data.height;
                agency = data.agency;
                phone = data.phone;
                email = data.email;
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
                agency,
                phone
            }

            // check if agency exists
            let agency_found = null;
            try {
                let {agency_db, error} = await supabase
                    .from('agency')
                    .select('name')
                    .eq('name', agency)
                    .single()

                if (error) throw error
                agency_found = agency_db;
            } catch (error) {
                alert(error.message)
            }


            if (!agency_found) {
                try {
                    let {error} = await supabase
                        .from('agency')
                        .insert([
                            {name: agency}
                        ])
                    if (error) throw error
                } catch (error) {
                    alert(error.message)
                }
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
        <label for="height">Height in cm (required)</label>
        <input
                id="height"
                type="number"
                required
                bind:value={height}
        />
    </div>


    <div>
        <label for="agency">Agency (required)</label>
        <input
                id="agency"
                type="text"
                required
                bind:value={agency}
        />
    </div>
    <div> <!-- TODO: fix can't clear field without crashing -->
        <label for="countries">Country (required)</label>
        <Select id="countries"
                isClearable={false}
                isMulti=true
                items={all_countries}
                bind:value={countries}
                inputStyles=""/>
    </div>

    <div>
        <label for="cities">Cities (required)</label>
        <Select id="cities" isMulti=true items={cities_filtered} value={cities}/>
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
