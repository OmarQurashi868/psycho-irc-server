const loginUser = require("../routes/users/userLogin");
const bcrypt = require('bcrypt');
const User = require("../classes/User");
const Token = require("../classes/Token");

jest.mock("../classes/User");
jest.mock("../classes/Token");
jest.mock("bcrypt");

const mockRequest = {
    body: {
        username: "johnDoe",
        password: "testing",
    }
}
const incompleteMockRequest = {
    body: {
        username: "johnDoe",
    }
}
const mockResponse = {
    status: jest.fn((x) => x),
    send: jest.fn((x) => x),
}

it("Should return a status code of 400 when properties are missing", async () => {
    await loginUser(incompleteMockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
});

it("Should return a status code of 404 when user doesn't exist", async () => {
    User.find.mockResolvedValueOnce(undefined);

    await loginUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
});

it("Should return a status code of 401 when password is incorrect", async () => {
    User.find.mockResolvedValueOnce({
        username: "johnDoe",
        password: "testingHashed"
    });

    bcrypt.compare.mockResolvedValueOnce(false);

    await loginUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.send).toHaveBeenCalledTimes(1);
});

it("Should return a status code of 200 when login is successful", async () => {
    User.find.mockResolvedValueOnce({
        username: "johnDoe",
        password: "testingHashed"
    });

    bcrypt.compare.mockResolvedValueOnce(true);

    Token.deleteAllForUser.mockResolvedValueOnce();
    Token.insert.mockResolvedValueOnce();

    await loginUser(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.send).toHaveBeenCalledWith({ token: expect.any(String) });
});