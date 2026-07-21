import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { NotesPage } from "@/app/NotesPage";

async function createNote(content: string) {
  const user = userEvent.setup();
  const newNoteInput = screen.getByLabelText("New note");
  await user.clear(newNoteInput);
  await user.type(newNoteInput, content);
  await user.click(screen.getByRole("button", { name: "Create note" }));
}

describe("NotesPage", () => {
  it("creates notes and keeps the most recent note at the top", async () => {
    render(createElement(NotesPage));

    await createNote("First note");
    await createNote("Second note");

    const list = screen.getByRole("list", { name: "Notes list" });
    const items = within(list).getAllByRole("listitem");

    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Second note");
    expect(items[1]).toHaveTextContent("First note");
  });

  it("edits an existing note", async () => {
    const user = userEvent.setup();
    render(createElement(NotesPage));

    await createNote("Draft content");
    await user.click(screen.getByRole("button", { name: "Edit" }));

    const listItem = screen.getByRole("listitem");
    const editInput = within(listItem).getByRole("textbox");

    await user.clear(editInput);
    await user.type(editInput, "Updated content");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByText("Updated content")).toBeInTheDocument();
    expect(screen.queryByText("Draft content")).not.toBeInTheDocument();
  });

  it("deletes an existing note", async () => {
    const user = userEvent.setup();
    render(createElement(NotesPage));

    await createNote("Note to remove");
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(screen.queryByText("Note to remove")).not.toBeInTheDocument();
    expect(screen.getByText("No notes found.")).toBeInTheDocument();
  });

  it("filters notes by keyword", async () => {
    const user = userEvent.setup();
    render(createElement(NotesPage));

    await createNote("Buy milk");
    await createNote("Read docs");
    await user.type(screen.getByLabelText("Search notes"), "milk");

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.queryByText("Read docs")).not.toBeInTheDocument();
  });
});

