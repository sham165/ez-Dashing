import UUID from "utils/UUID";

describe("UUID", () => {

  it("random() should return a valid UUID", () => {
    let uuid = UUID.random();
    expect(uuid.length).toStrictEqual(36);
    expect((uuid.toString().match(/-/g) || []).length).toStrictEqual(4);
  });

});
