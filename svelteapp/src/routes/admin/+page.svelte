<script>
    import LoginForm from "./LoginForm.svelte";
</script>

<h1 class="heading">Admin Console</h1>
<div class="container">
    <LoginForm />
</div>

<style>
    .container {
        margin: 0 auto;
        padding: 1rem;
        height: 100vh;
        text-transform: uppercase;
    }
    .heading {
        text-align: center;
        font-weight: 700;
        color: #b3b3b3;
    }
</style>
