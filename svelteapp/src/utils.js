const constructUrl = (host, port, path) => {
    const rawUrl = host.startsWith("http") ? host : `http://${host}`;
    const redirectUrl = path ? new URL(path, rawUrl) : new URL(rawUrl);
    if (port) {
        redirectUrl.port = port;
    }
    return redirectUrl;
};

export default constructUrl;
