import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SearchInput } from "./search-input";

const onSearchChangeCallback = vi.fn();

describe("Search Input", () => {
  beforeEach(() => {
    onSearchChangeCallback.mockClear();
  });

  it("should have value equal to List A1", () => {
    const wrapper = render(
      <SearchInput query="Lista A1" onChange={onSearchChangeCallback} />
    );

    expect(wrapper.getByDisplayValue("Lista A1"));
  });

  it("should call with any value except null or undefined", async () => {
    const user = userEvent.setup();
    const wrapper = render(
      <SearchInput query="" onChange={onSearchChangeCallback} />
    );
    const input = wrapper.getByPlaceholderText("Search");

    await user.clear(input);
    await user.type(input, "Lista A1");

    expect(onSearchChangeCallback).toHaveBeenCalled();
    expect(onSearchChangeCallback).toHaveBeenCalledWith(expect.anything());
  });
});
