<script>
    import {supabase} from "./supabaseClient";
    import {user} from "./sessionStore";
    import moment from "moment-timezone";
    import Select from 'svelte-select';
    import {getAttributes} from "./attributes/get-attributes"
    import {updateLanguages} from "./attributes/lang";

    let loading = true;
    let attributes = [{}]

    $: if (attributes.agencies === undefined || attributes.agencies === null) attributes.agencies = []
    $: if (attributes.gender !== null) attributes.gender.value ? attributes.gender.value : attributes.gender;
    $: if (attributes.skin_color !== null) attributes.skin_color = attributes.skin_color.value ? attributes.skin_color.value : attributes.skin_color;
    $: if (attributes.hair_color !== null) attributes.hair_color = attributes.hair_color.value ? attributes.hair_color.value : attributes.hair_color;

    $: if (attributes.cities === undefined || attributes.cities === null) attributes.cities = [];
    else attributes.cities = attributes.cities.map((city) => city.value ? city.value : city)

    $: if (attributes.locations === undefined || attributes.locations === null) attributes.locations = []
    else attributes.locations = attributes.locations.map((city) => city.value ? city.value : city)

    $: if (attributes.lang_primary === undefined || attributes.lang_primary === null) attributes.lang_primary = []
    $: if (attributes.lang_secondary === undefined || attributes.lang_secondary === null) attributes.lang_secondary = []

    const user = supabase.auth.user();


    async function getProfile() {
        loading = true;
        attributes = await getAttributes(user.id);
        loading = false
    }

    async function updateProfile() {
        loading = true
        await updateLanguages(attributes.lang_primary, attributes.lang_secondary, user.id)

        let {error_delete_tags} = await supabase
            .from('usertags')
            .delete()
            .eq('userid', user.id)

        if (error_delete_tags) throw error_delete_tags


        for (let tag of tags) {
            // if tags does not exist create it:

            // insert tags
        }

        // agencies
        // delete all agencies of user

        let {error_delete_agencies} = await supabase
            .from('usersagency')
            .delete()
            .eq('userid', user.id)

        if (error_delete_agencies) throw error_delete_agencies


        try {
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
                countries: locations.map((city) => city.split("-")[1].trim()),
                cities: locations.map((city) => city.split("-")[0].trim()),
                gender,
                locations: locations,
                last_updated: moment().tz("Europe/Paris").format("yyyy-MM-DD HH:mm:ss")
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
        <input id="last_casting" type="text" value={last_updated ? last_updated : "Never"} disabled>
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
        <Select id="agency" isMulti=true items={agencies_choice} bind:value={agencies} isCreatable=true/>
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
        <Select id="tags" isMulti=true items={tags_choice} bind:value={tags} isCreatable=true/>
    </div>

    <div>
        <label>Cities (required)</label>
        <Select id="cities"
                isVirtualList="{true}"
                isMulti=true items={all_cities} bind:value={locations}/>
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
