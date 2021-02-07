export function htmlEntry (spec:{
    title:string,
    cssBundle:string;
    jsBundle:string;
    description:string;
    manifest:boolean;
    viewPort:string;
    headHtml:string;
    bodyHtml:string;
}) {
    return `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>${spec.title}</title>
            <meta name="description" content="${spec.description || ''}">
            ${spec.cssBundle ? `<link rel="stylesheet" type="text/css" href="${spec.cssBundle}">` : ''}
            ${spec.manifest ? `
            <link rel="manifest" href="/manifest.json">
            <meta name="theme-color" content="#FFFFFF"> `: ''}
            ${spec.headHtml || ''}
        </head>
        <body>
            <noscript>Please allow JavaScript in order to use this site.</noscript>
            ${spec.bodyHtml || ''}
            ${spec.jsBundle ? `<script type="text/javascript" src="${spec.jsBundle}" defer></script>` : ''}
        </body>
    </html>
    `;
}