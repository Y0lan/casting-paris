<script>
    import {supabase} from "./supabaseClient";
    let loading = false;
    let email;

    const handleLogin = async () => {
        try {
            loading = true
            const { error } = await supabase.auth.signIn({email})
            if (error) throw error
            //TODO ameliorer l'alerte mdr
            alert("check your email for the login link!")
        } catch (error) {
            alert(error.message)
        } finally {
            loading = false
        }
    }
</script>

<form class="row flex flex-center" on:submit|preventDefault={handleLogin}>
    <div class="col-6 form-widget">
        <h1 class="header">Casting Paris</h1>
        <p class="description">Sign in via magic link with your email below</p>
        <div>
            <input
                    class="inputField"
                    type="email"
                    placeholder="Your email"
                    bind:value={email}
            />
        </div>
        <div>
            <input type="submit" class='button block' value={loading ? "Loading" : "Send magic link"} disabled={loading} />
        </div>
    </div>
</form>
