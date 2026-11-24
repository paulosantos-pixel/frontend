// frontend/src/tp/santos.test.jsx
import React from "react";
import { describe, it, expect } from "vitest";
import { authHeaders } from "../services/api";
import { render, screen } from "@testing-library/react";
import ProductCard from "../components/ProductCard";
import { CarritoProvider } from "../context/CarritoContext";
import { MemoryRouter } from "react-router-dom";

describe("FT1 - authHeaders()", () => {
  it("con token arma Authorization Bearer", () => {
    localStorage.setItem("access_token", "abc123");
    expect(authHeaders()).toHaveProperty("Authorization", "Bearer abc123");
  });
  it("sin token no manda Authorization", () => {
    localStorage.removeItem("access_token");
    expect(authHeaders()).not.toHaveProperty("Authorization");
  });
});

describe("FT7 - Tarjeta de producto", () => {
  it("con imagen, la img tiene alt y loading='lazy'", () => {
    render(
      <MemoryRouter>
        <CarritoProvider>
          <ProductCard id={1} nombre="Mate" precio_final={1000} imagen_url="/demo/mate.jpg" />
        </CarritoProvider>
      </MemoryRouter>
    );
    const img = screen.getByRole("img", { name: /mate/i });
    expect(img).toHaveAttribute("loading", "lazy");
  });
});