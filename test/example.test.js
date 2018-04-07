const assert = require('assert');
const { admin } = require('../controllers')

// NOTE: This is just an example of test
// NOTE: We can structure the tests by 
// NOTE: directory and test different portions 
// NOTE: of code of controller and type of respose it returns 

describe('Log in for admin', async () => {
    it('should log in with admin creds', async () => {
        const email = "admin@lms.com";
        const password = "123456";
        const {user, token} = await admin.login(email, password)
        expect(typeof token).to.equal('string');
        expect(user.email).to.equal('admin@lms.com');
        expect(user.status).to.equal('active');
    });
});