"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import { createListing, getCategories } from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug?: string;
}

const CONDITIONS = [
  { value: "FAULTY", label: "Faulty" },
  { value: "USED", label: "Used" },
  { value: "REFURBISHED", label: "Refurbished" },
  { value: "NEW", label: "New" },
];

const FAULT_SEVERITIES = [
  { value: "MINOR", label: "Minor" },
  { value: "MODERATE", label: "Moderate" },
  { value: "MAJOR", label: "Major" },
  { value: "CRITICAL", label: "Critical" },
];

export default function CreateListingPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("FAULTY");
  const [faultSeverity, setFaultSeverity] = useState("MODERATE");
  const [faultDescription, setFaultDescription] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [negotiable, setNegotiable] = useState(true);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const result = await getCategories();

        console.log("CATEGORIES:", result);

        setCategories(
          Array.isArray(result)
            ? result
            : result?.items ?? []
        );
      } catch (err) {
        console.error("Categories Error:", err);

        setError(
          "Unable to load categories. Please refresh the page."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    const remainingSlots = 10 - images.length;

    if (remainingSlots <= 0) {
      setError("You can upload a maximum of 10 images.");
      return;
    }

    const selectedFiles = files.slice(0, remainingSlots);

    const invalidFiles = selectedFiles.filter(
      (file) => !file.type.startsWith("image/")
    );

    if (invalidFiles.length > 0) {
      setError("Only image files are allowed.");
      return;
    }

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );

    if (oversizedFiles.length > 0) {
      setError("Each image must be 10MB or smaller.");
      return;
    }

    setError(null);

    setImages((current) => [
      ...current,
      ...selectedFiles,
    ]);

    setPreviews((current) => [
      ...current,
      ...selectedFiles.map((file) =>
        URL.createObjectURL(file)
      ),
    ]);

    event.target.value = "";
  }

  function removeImage(index: number) {
    setImages((current) =>
      current.filter((_, i) => i !== index)
    );

    setPreviews((current) => {
      const preview = current[index];

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      return current.filter((_, i) => i !== index);
    });
  }

  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (!title.trim()) {
      setError("Please enter a listing title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setError("Please enter a valid price.");
      return;
    }

    if (!condition) {
      setError("Please select a condition.");
      return;
    }

    if (!state.trim()) {
      setError("Please enter the state.");
      return;
    }

    if (!city.trim()) {
      setError("Please enter the city.");
      return;
    }

    try {
      setSubmitting(true);

      const listing = await createListing({
        title: title.trim(),
        description: description.trim(),
        categoryId,
        price: Number(price),
        currency: "NGN",
        condition,
        faultSeverity,
        faultDescription:
          faultDescription.trim() || undefined,
        location:
          location.trim() || undefined,
        state: state.trim(),
        city: city.trim(),
        negotiable,
        images,
      });

      console.log(
        "LISTING CREATED:",
        listing
      );

      if (listing?.slug) {
        router.push(
          `/listings/${listing.slug}`
        );
      } else if (listing?.id) {
        router.push(
          `/listings/id/${listing.id}`
        );
      } else {
        router.push("/dashboard/listings");
      }
    } catch (err: any) {
      console.error(
        "Create Listing Error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create listing. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/listings")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Listings
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Create Listing
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            List a faulty vehicle, appliance, laptop,
            or other repairable item on FaultMart.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* Basic Information */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Tell buyers what you are selling.
              </p>
            </div>

            <div className="space-y-5">

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Listing Title
                </label>

                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. HP EliteBook 840"
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value
                    )
                  }
                  placeholder="Describe the item, what works, what is faulty, and any other important details."
                  rows={5}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  required
                />
              </div>

              {/* Category / Condition */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    value={categoryId}
                    onChange={(event) =>
                      setCategoryId(
                        event.target.value
                      )
                    }
                    disabled={loadingCategories}
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 disabled:bg-neutral-100"
                    required
                  >
                    <option value="">
                      {loadingCategories
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="condition"
                    className="mb-2 block text-sm font-semibold text-neutral-800"
                  >
                    Condition
                  </label>

                  <select
                    id="condition"
                    value={condition}
                    onChange={(event) =>
                      setCondition(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                    required
                  >
                    {CONDITIONS.map(
                      (item) => (
                        <option
                          key={item.value}
                          value={item.value}
                        >
                          {item.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Price
                </label>

                <div className="flex">
                  <div className="flex items-center rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold text-neutral-600">
                    NGN
                  </div>

                  <input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(event) =>
                      setPrice(
                        event.target.value
                      )
                    }
                    placeholder="120000"
                    className="min-w-0 flex-1 rounded-r-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                    required
                  />
                </div>
              </div>

            </div>
          </section>

          {/* Fault Details */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Fault Details
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Help buyers understand what needs repair.
              </p>
            </div>

            <div className="space-y-5">

              <div>
                <label
                  htmlFor="faultSeverity"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Fault Severity
                </label>

                <select
                  id="faultSeverity"
                  value={faultSeverity}
                  onChange={(event) =>
                    setFaultSeverity(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                >
                  {FAULT_SEVERITIES.map(
                    (item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="faultDescription"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Fault Description
                </label>

                <textarea
                  id="faultDescription"
                  value={faultDescription}
                  onChange={(event) =>
                    setFaultDescription(
                      event.target.value
                    )
                  }
                  placeholder="e.g. LCD is cracked but the laptop powers on."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Location
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Where can buyers find the item?
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  Location
                </label>

                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Ikeja"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(
                      event.target.value
                    )
                  }
                  placeholder="Lagos"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-semibold text-neutral-800"
                >
                  State
                </label>

                <input
                  id="state"
                  type="text"
                  value={state}
                  onChange={(event) =>
                    setState(
                      event.target.value
                    )
                  }
                  placeholder="Lagos"
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  required
                />
              </div>

            </div>
          </section>

          {/* Images */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Listing Images
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Add up to 10 images. Clear photos help buyers
                understand the item and its faults.
              </p>
            </div>

            <div className="space-y-5">

              {/* Upload */}
              <label
                htmlFor="images"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 py-10 text-center transition hover:border-neutral-400 hover:bg-neutral-100"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <ImagePlus className="h-7 w-7 text-neutral-500" />
                </div>

                <p className="text-sm font-semibold text-neutral-800">
                  Click to select images
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  PNG, JPG, WEBP • Maximum 10MB each
                </p>

                <p className="mt-2 text-xs font-medium text-neutral-400">
                  {images.length}/10 images selected
                </p>

                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={images.length >= 10}
                />
              </label>

              {/* Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {previews.map(
                    (preview, index) => (
                      <div
                        key={`${preview}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl bg-neutral-100"
                      >
                        <Image
                          src={preview}
                          alt={`Selected image ${index + 1}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(index)
                          }
                          className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-red-600 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white"
                          title="Remove image"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white">
                            Main image
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

            </div>
          </section>

          {/* Options */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(event) =>
                  setNegotiable(
                    event.target.checked
                  )
                }
                className="mt-1 h-4 w-4 rounded border-neutral-300"
              />

              <span>
                <span className="block text-sm font-semibold text-neutral-800">
                  Price is negotiable
                </span>

                <span className="mt-1 block text-xs text-neutral-500">
                  Allow buyers to negotiate the listed price.
                </span>
              </span>
            </label>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/listings")
              }
              disabled={submitting}
              className="rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Create Listing
                </>
              )}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}