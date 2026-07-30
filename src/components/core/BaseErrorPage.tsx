export default function baseErrorPage({errorCode, errorMessage}: {
    errorCode?: number;
    errorMessage?: string
}) {
    return (
        <div className={"flex flex-col justify-center items-center h-screen w-screen gap-2"}>
            <h1>Ok, we hit a dead end.</h1>
            {errorCode && <p>ErrorCode: {errorCode}.</p>}
            {errorMessage && <p>ErrorMessage: {errorMessage}.</p>}
            <div className={"text-center px-5"}>
                <p>If the see 5XX can you mail me at vardhanbattula7@gmail.com.</p>
            </div>
        </div>
    )
}