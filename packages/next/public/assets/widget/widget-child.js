window.PurplePassZoid = zoid.create({
    tag: 'purplepass-widget-1',
    url: '/assets/widget/test.html',
    dimensions: {
        width: '100%',
        height: '500px',
    },
    autoResize: { height: true, width: false },
});

window.PurplePassZoid2 = zoid.create({
    tag: 'purplepass-widget-2',
    url: '/assets/widget/test.html',
    dimensions: {
        width: '100%',
        height: '500px',
    },
    autoResize: { height: true, width: false },
});

window.PurplePassZoidPopup = zoid.create({
    tag: 'purplepass-widget-popup',
    url: '/assets/widget/test.html',
    dimensions: {
        width: '100%',
        height: '80vh',
    },
    autoResize: { height: false, width: false },
});

window.PurplePassZoidAsePopup = zoid.create({
    tag: 'purplepass-widget-ase',
    url: '/assets/widget/test.html',
    dimensions: {
        width: '100%',
        height: window.screen.width > 800 ? '80vh' : '100%',
    },
    autoResize: { height: true, width: false }, //    url: PP_BASEURL + 'assets/test.html',
});
