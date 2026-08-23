import { describe, expect, it } from "vitest";
import { getBooks, getMagazines, search } from "./index";

describe("the archive", () => {
  it("exposes both collections", () => {
    expect(getBooks()).toHaveLength(7);
    expect(getMagazines()).toHaveLength(7);
  });

  it("gives every item a uid that is unique across the whole archive", () => {
    // Books and magazines both use ids 1..7, so `id` alone cannot identify an item.
    const items = [...getBooks(), ...getMagazines()];
    const uids = new Set(items.map((item) => item.uid));

    expect(uids.size).toBe(items.length);
    expect(getBooks()[0].uid).toBe("book-1");
    expect(getMagazines()[0].uid).toBe("magazine-1");
  });

  it("serves every asset url from the public root", () => {
    for (const item of [...getBooks(), ...getMagazines()]) {
      expect(item.url.startsWith("/") || /^https?:\/\//.test(item.url)).toBe(true);
    }
  });

  it("maps the source JSON's capitalised fields onto domain names", () => {
    const book = getBooks()[0];

    expect(book.name).toBe("Домът на Велзевул");
    expect(book.year).toBe(2002);
    expect(book.pages).toBe(208);
    expect(book.format).toBe("60×84/16");
    // The source shape must not leak through.
    expect(book).not.toHaveProperty("Year");
    expect(book).not.toHaveProperty("text");
  });

  it("resolves a bundled pdf for the books that have one, and empty for the rest", () => {
    const withPdf = getBooks().filter((book) => book.link);
    const withoutPdf = getBooks().filter((book) => !book.link);

    expect(withPdf).toHaveLength(2);
    expect(withoutPdf).toHaveLength(5);
    for (const book of withPdf) {
      expect(book.link).toMatch(/\.pdf$/);
    }
  });

  it("returns nothing for an empty or whitespace query", () => {
    expect(search("")).toEqual([]);
    expect(search("   ")).toEqual([]);
  });

  it("searches books and magazines together", () => {
    const kinds = new Set(search("а").map((item) => item.kind));

    expect(kinds.has("book")).toBe(true);
    expect(kinds.has("magazine")).toBe(true);
  });

  it("honours the search mode", () => {
    const author = getBooks()[0].author;

    expect(search(author, "author").length).toBeGreaterThan(0);
    expect(search(author, "year")).toEqual([]);
  });

  it("matches case-insensitively on the title", () => {
    const name = getBooks()[0].name;

    expect(search(name.toUpperCase(), "title").map((i) => i.uid)).toContain("book-1");
  });
});
