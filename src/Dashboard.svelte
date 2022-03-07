<script>
    import {supabase} from "./supabaseClient";

    const mySubscription = supabase
        .from('users')
        .on('*', payload => {
            console.log('Change received!', payload)
        })
        .subscribe()

</script>

