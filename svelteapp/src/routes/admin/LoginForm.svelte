<script>
    let triggerError = false;

    const authenticate = async () => {
        triggerError = false;
        const username = document.querySelector(
            "input[placeholder='Username']"
        ).value.toLowerCase();
        const password = document.querySelector(
            "input[placeholder='Password']"
        ).value;
        const response = await fetch("/api/admin", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            const { redirectUrl } = await response.json();
            location.assign(redirectUrl);
        } else {
            triggerError = true;
        }
    };
</script>

<div class="container">
    <form class="login-form" on:submit|preventDefault={authenticate}>
        <h2 class="heading" data-short-text="Login">Please Login to Continue</h2>
        <input type="text" name="username" placeholder="Username" />
        <input type="password" name="password" placeholder="Password" />
        <p class="error" class:show={triggerError}>Invalid Credentials</p>
        <button type="submit">LOGIN</button>
    </form>
</div>

<style>
    .heading {
        text-align: center;
        font-weight: 700;
        color: #b3b3b3;
    }
    .login-form {
        position: fixed;
        left: 50%;
        transform: translate(-50%, 25%);
        width: 60vw;
        background-color: #1f1f1f;
        color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        padding-top: 0.5rem;
    }
    .login-form h2::after {
        display: none;
        content: attr(data-short-text);
        position: absolute;
        top: 10%;
        left: 0;
        right: 0;
        bottom: 0;
        width: 60vw;
        margin: auto;
        pointer-events: none;
    }
    .login-form input[type="text"],
    .login-form input[type="password"] {
        width: 100%;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: none;
        background-color: #333;
        color: #fff;
        font-size: 16px;
    }

    p.error {
        color: #ff0000;
        font-size: 14px;
        margin: 0;
        margin-bottom: 20px;
        display: none;
    }

    p.error.show {
        display: block;
    }

    .login-form button[type="submit"] {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: none;
        background-color: var(--theme-primary);
        color: #fff;
        font-size: 16px;
        cursor: pointer;
    }

    .login-form button[type="submit"]:hover {
        filter: brightness(1.1);
    }

    @media screen and (max-width: 640px) {
        .login-form h2 {
            color: transparent;
        }
        .login-form h2::after {
            display: block;
            color: #fff;
        }
    }
</style>
