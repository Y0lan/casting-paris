<script>
    import {supabase} from "./supabaseClient";
    import {user} from "./sessionStore";

    console.log(user)
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

    async function getProfile() {
        try {
            loading = true;
            const user = supabase.auth.user();

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
                details = data.details;
                height = data.height;
                agency = data.agency;
                phone = data.phone;
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
        <label for="name">Name</label>
        <input
                id="name"
                type="text"
                bind:value={name}
        />
    </div>
    <div>
        <label for="surname">Surname</label>
        <input
                id="surname"
                type="text"
                bind:value={surname}
        />
    </div>
    <div>
        <label for="birthdate">Date of Birth</label>
        <input
                id="birthdate"
                type="date"
                bind:value={birthdate}
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
        <label for="chest_size">Chest size</label>
        <input
                id="chest_size"
                type="number"
                bind:value={chest_size}
        />
    </div>
    <div>
        <label for="waist_size">Waist size</label>
        <input
                id="waist_size"
                type="number"
                bind:value={waist_size}
        />
    </div>
    <div>
        <label for="hip_size">Hip size</label>
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
        <textarea
                id="details"
                type="text"
                bind:value={details}></textarea>
    </div>
    <div>
        <label for="height">Height</label>
        <input
                id="height"
                type="number"
                bind:value={height}
        />
    </div>
    <div>
        <label for="agency">Agency</label>
        <input
                id="agency"
                type="text"
                bind:value={agency}
        />
    </div>
    <div>
        <label for="phone">Phone</label>
        <input
                id="phone"
                type="tel"
                bind:value={phone}
        />
    </div>

    <div>
        <input type="submit" class="button block primary" value={loading ? 'Loading ...' : 'Update'}
               disabled={loading}/>
    </div>

    <div>
        <button class="button block" on:click={signOut} disabled={loading}>
            Sign Out
        </button>
    </div>
</form>
