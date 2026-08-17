"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";

import {
  getListingById,
  getCategories,
  updateListing,
} from "@/lib/api";

interface Category {
  id: string;
  name: string;
  slug?: string;
}

interface ExistingImage {
  id?: string;
  url: string;
  publicId?: string | null;
  position?: number;
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

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();

  const listingId = String(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] =
    useState(true);

  const [loadingListing, setLoadingListing] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [price, setPrice] = useState("");

  const [condition, setCondition] =
    useState("FAULTY");

  const [faultSeverity, setFaultSeverity] =
    useState("MODERATE");

  const [faultDescription, setFaultDescription] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [state, setState] =
    useState("");

  const [city, setCity] =
    useState("");

  const [negotiable, setNegotiable] =
    useState(true);

  /*
   * Existing Cloudinary images.
   */
  const [existingImages, setExistingImages] =
    useState<ExistingImage[]>([]);

  /*
   * Newly selected replacement images.
   */
  const [images, setImages] =
    useState<File[]>([]);

  const [previews, setPreviews] =
    useState<string[]>([]);

  /*
   * Load categories.
   */
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);

        const result = await getCategories();

        setCategories(
          Array.isArray(result)
            ? result
            : result?.items ?? []
        );
      } catch (err) {
        console.error(
          "Categories Error:",
          err
        );

        setError(
          "Unable to load categories. Please refresh the page."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  /*
   * Load listing.
   */
  useEffect(() => {
    if (!listingId) {
      return;
    }

    async function loadListing() {
      try {
        setLoadingListing(true);
        setError(null);

        const listing =
          await getListingById(listingId);

        console.log(
          "EDIT LISTING:",
          listing
        );

        setTitle(listing.title ?? "");

        setDescription(
          listing.description ?? ""
        );

        setCategoryId(
          listing.categoryId ??
            listing.category?.id ??
            ""
        );

        setPrice(
          listing.price !== undefined &&
            listing.price !== null
            ? String(listing.price)
            : ""
        );

        setCondition(
          listing.condition ?? "FAULTY"
        );

        setFaultSeverity(
          listing.faultSeverity ??
            "MODERATE"
        );

        setFaultDescription(
          listing.faultDescription ?? ""
        );

        setLocation(
          listing.location ?? ""
        );

        setState(
          listing.state ?? ""
        );

        setCity(
          listing.city ?? ""
        );

        setNegotiable(
          listing.isNegotiable ??
            listing.negotiable ??
            true
        );

        setExistingImages(
          Array.isArray(listing.images)
            ? listing.images
                .sort(
                  (
                    a: ExistingImage,
                    b: ExistingImage
                  ) =>
                    (a.position ?? 0) -
                    (b.position ?? 0)
                )
                .map(
                  (
                    image: ExistingImage
                  ) => ({
                    id: image.id,
                    url: image.url,
                    publicId:
                      image.publicId,
                    position:
                      image.position,
                  })
                )
            : []
        );
      } catch (err: any) {
        console.error(
          "Load Listing Error:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to load listing.";

        setError(message);
      } finally {
        setLoadingListing(false);
      }
    }

    loadListing();
  }, [listingId]);

  /*
   * New image selection.
   *
   * IMPORTANT:
   * New images replace the existing image set.
   */
  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    if (files.length === 0) {
      return;
    }

    const remainingSlots =
      10 - images.length;

    if (remainingSlots <= 0) {
      setError(
        "You can upload a maximum of 10 images."
      );
      return;
    }

    const selectedFiles = files.slice(
      0,
      remainingSlots
    );

    const invalidFiles =
      selectedFiles.filter(
        (file) =>
          !file.type.startsWith("image/")
      );

    if (invalidFiles.length > 0) {
      setError(
        "Only image files are allowed."
      );
      return;
    }

    const oversizedFiles =
      selectedFiles.filter(
        (file) =>
          file.size >
          10 * 1024 * 1024
      );

    if (oversizedFiles.length > 0) {
      setError(
        "Each image must be 10MB or smaller."
      );
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
      current.filter(
        (_, i) => i !== index
      )
    );

    setPreviews((current) => {
      const preview = current[index];

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      return current.filter(
        (_, i) => i !== index
      );
    });
  }

  /*
   * Clean preview object URLs.
   */
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, [previews]);

  /*
   * Submit update.
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    if (!title.trim()) {
      setError(
        "Please enter a listing title."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter a description."
      );
      return;
    }

    if (!categoryId) {
      setError(
        "Please select a category."
      );
      return;
    }

    if (!price || Number(price) <= 0) {
      setError(
        "Please enter a valid price."
      );
      return;
    }

    if (!condition) {
      setError(
        "Please select a condition."
      );
      return;
    }

    if (!state.trim()) {
      setError(
        "Please enter the state."
      );
      return;
    }

    if (!city.trim()) {
      setError(
        "Please enter the city."
      );
      return;
    }

    try {
      setSubmitting(true);

      /*
       * IMPORTANT:
       *
       * Do NOT send images: [] when the seller
       * hasn't selected replacement images.
       *
       * The backend interprets the presence of
       * data.images as a request to replace the
       * existing image set.
       */
      const payload = {
        title: title.trim(),

        description:
          description.trim(),

        categoryId,

        price: Number(price),

        currency: "NGN",

        condition,

        faultSeverity,

        faultDescription:
          faultDescription.trim(),

        location:
          location.trim(),

        state: state.trim(),

        city: city.trim(),

        negotiable,

        ...(images.length > 0
          ? { images }
          : {}),
      };

      const listing =
        await updateListing(
          listingId,
          payload
        );

      console.log(
        "LISTING UPDATED:",
        listing
      );

      router.push(
        "/dashboard/listings"
      );
    } catch (err: any) {
      console.error(
        "Update Listing Error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to update listing. Please try again.";

      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingListing) {
    return (
      <main className="min-h-screen bg-neutral-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-neutral-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading listing...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/listings"
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Listings
          </button>

          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Edit Listing
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Update your listing information,
            pricing, condition, or images.
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
                Update what buyers see about
                your item.
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
                    setTitle(
                      event.target.value
                    )
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
                    disabled={
                      loadingCategories
                    }
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
                Help buyers understand what
                needs repair.
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

          {/* Negotiable */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-bold text-neutral-900">
                  Price Negotiation
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Allow buyers to negotiate
                  the listed price.
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={negotiable}
                onClick={() =>
                  setNegotiable(
                    (current) => !current
                  )
                }
                className={`relative inline-flex h-7 w-12 shrink-0 rounded-full transition ${
                  negotiable
                    ? "bg-neutral-900"
                    : "bg-neutral-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 translate-y-1 rounded-full bg-white shadow-sm transition ${
                    negotiable
                      ? "translate-x-6"
                      : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Images */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-neutral-900">
                Images
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Your current images are shown
                below. Selecting new images will
                replace all current images when
                you save.
              </p>
            </div>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-neutral-800">
                  Current Images
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {existingImages.map(
                    (image, index) => (
                      <div
                        key={
                          image.id ??
                          `${image.url}-${index}`
                        }
                        className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                      >
                        <Image
                          src={image.url}
                          alt={`Current listing image ${
                            index + 1
                          }`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />

                        {index === 0 && (
                          <div className="absolute left-2 top-2 rounded-md bg-neutral-900 px-2 py-1 text-xs font-semibold text-white">
                            Main
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Replacement upload */}
            <div>
              <p className="mb-3 text-sm font-semibold text-neutral-800">
                Replacement Images
              </p>

              <label
                htmlFor="images"
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center transition hover:border-neutral-500 hover:bg-neutral-100"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <ImagePlus className="h-6 w-6 text-neutral-700" />
                </div>

                <p className="text-sm font-semibold text-neutral-900">
                  Select replacement images
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  PNG, JPG, WEBP up to 10MB each
                </p>

                <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-xs font-semibold text-white">
                  <Upload className="h-4 w-4" />
                  Choose Images
                </span>

                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* New image previews */}
            {previews.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-neutral-800">
                  New Images
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {previews.map(
                    (preview, index) => (
                      <div
                        key={preview}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                      >
                        <Image
                          src={preview}
                          alt={`New listing image ${
                            index + 1
                          }`}
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
                          }
                          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/90 text-red-600 shadow-sm transition hover:bg-white"
                          aria-label={`Remove image ${
                            index + 1
                          }`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 rounded-md bg-neutral-900 px-2 py-1 text-xs font-semibold text-white">
                            Main
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/listings"
                )
              }
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}