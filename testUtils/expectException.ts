


export async function expectException (promise: Promise<any>, expectedError: string) {
    try {
        await promise;
    } catch (error) {
        if (error.message.indexOf(expectedError) === -1 &&
            error.message.indexOf("Error: Invalid JSON RPC response:") === -1) 
        {
            // When the exception was a revert, the resulting string will include only
            // the revert reason, otherwise it will be the type of exception (e.g. 'invalid opcode')
            const actualError = error.message.replace(
                /Returned error: VM Exception while processing transaction: (revert )?/,
                '',
            );
            expect(actualError).to.equal(expectedError, 'Wrong kind of exception received');
        }
        return;
    }
  
    expect.fail('Expected an exception but none was received');
}
