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
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";

import {
  createListing,
  generateListingAssistant,
  getCategories,
  type ListingAssistantResult,
} from "@/lib/api";
import TransactionDisclaimer from "@/components/legal/TransactionDisclaimer";

interface Category {
  id: string;
  name: string;
  slug?: string;
}

const CONDITIONS = [
  { value: "FAULTY", label: "Faulty" },
  { value: "USED", label: "Used" },
  { value: "REFURBISHED", label: "Refurbished" },
  { value: "BRAND_NEW", label: "New" },
];

const FAULT_SEVERITIES = [
  { value: "MINOR", label: "Minor" },
  { value: "MODERATE", label: "Moderate" },
  { value: "MAJOR", label: "Major" },
  { value: "CRITICAL", label: "Critical" },
];

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      }
    ).response;

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return fallback;
}

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
  const [sellerDisclaimerAccepted, setSellerDisclaimerAccepted] =
  useState(false);

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState<string | null>(null);
const [aiResult, setAiResult] =
  useState<ListingAssistantResult | null>(null);

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
      } catch (err: unknown) {
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

  async function handleGenerateAI() {
  setAiError(null);
  setAiResult(null);

  if (
    !title.trim() &&
    !description.trim() &&
    !faultDescription.trim()
  ) {
    setAiError(
      "Please provide at least a title, description, or fault description before using AI."
    );
    return;
  }

  try {
    setAiLoading(true);

    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );

    const result = await generateListingAssistant({
      title: title.trim() || undefined,
      description:
        description.trim() || undefined,
      category:
        selectedCategory?.name || undefined,
      condition:
        condition || undefined,
      faultSeverity:
        faultSeverity || undefined,
      faultDescription:
        faultDescription.trim() || undefined,
    });

    setAiResult(result);
  } catch (err: unknown) {
    console.error(
      "AI Listing Assistant Error:",
      err
    );

    const message = getErrorMessage(
  err,
  "Unable to generate AI suggestions. Please try again."
);

    setAiError(message);
  } finally {
    setAiLoading(false);
  }
}
function applyAISuggestions() {
  if (!aiResult) {
    return;
  }

  if (aiResult.suggestedTitle?.trim()) {
    setTitle(aiResult.suggestedTitle.trim());
  }

  if (aiResult.improvedDescription?.trim()) {
    setDescription(
      aiResult.improvedDescription.trim()
    );
  }

  if (aiResult.suggestedFaultSeverity) {
    setFaultSeverity(
      aiResult.suggestedFaultSeverity
    );
  }

  setAiError(null);
}

function applyAITitle() {
  if (aiResult?.suggestedTitle?.trim()) {
    setTitle(aiResult.suggestedTitle.trim());
  }
}

function applyAIDescription() {
  if (aiResult?.improvedDescription?.trim()) {
    setDescription(
      aiResult.improvedDescription.trim()
    );
  }
}

function applyAIFaultSeverity() {
  if (aiResult?.suggestedFaultSeverity) {
    setFaultSeverity(
      aiResult.suggestedFaultSeverity
    );
  }
}

async function handleAIListingAssistant() {
  setAiError(null);
  setAiResult(null);

  if (
    !title.trim() &&
    !description.trim() &&
    !faultDescription.trim()
  ) {
    setAiError(
      "Please enter some listing information before using the AI assistant."
    );
    return;
  }

  try {
    setAiLoading(true);

    const selectedCategory = categories.find(
      (category) => category.id === categoryId
    );

    const result = await generateListingAssistant({
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      category: selectedCategory?.name,
      condition: condition || undefined,
      faultSeverity: faultSeverity || undefined,
      faultDescription:
        faultDescription.trim() || undefined,
    });

    setAiResult(result);
  } catch (err: unknown) {
    console.error(
      "AI Listing Assistant Error:",
      err
    );

    setAiError(
  getErrorMessage(
    err,
    "Unable to generate AI suggestions. Please try again."
  )
);
  } finally {
    setAiLoading(false);
  }
}
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
if (!sellerDisclaimerAccepted) {
  setError(
    "Please acknowledge the seller transaction disclaimer before creating your listing."
  );

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
    } catch (err: unknown) {
      console.error(
        "Create Listing Error:",
        err
      );

      const message = getErrorMessage(
  err,
  "Unable to create listing. Please try again."
);
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
  <div className="mb-2 flex items-center justify-between gap-3">
    <label
      htmlFor="description"
      className="block text-sm font-semibold text-neutral-800"
    >
      Description
    </label>

    <button
      type="button"
      onClick={handleAIListingAssistant}
      disabled={aiLoading || submitting}
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {aiLoading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Improving...
        </>
      ) : (
        <>
          ✨ Improve with AI
        </>
      )}
    </button>
  </div>
{aiError && (
  <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {aiError}
  </div>
)}

{aiResult && (
  <div className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
    <div className="mb-4">
      <h3 className="text-sm font-bold text-neutral-900">
        ✨ AI Listing Suggestions
      </h3>

      <p className="mt-1 text-xs text-neutral-500">
        Review the suggestions below before applying them.
      </p>
    </div>

    <div className="space-y-4">
      {/* Suggested title */}
      {aiResult.suggestedTitle && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Suggested Title
          </p>

          <p className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800">
            {aiResult.suggestedTitle}
          </p>
        </div>
      )}

      {/* Improved description */}
      {aiResult.improvedDescription && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Improved Description
          </p>

          <p className="whitespace-pre-line rounded-lg border border-neutral-200 bg-white px-3 py-3 text-sm leading-6 text-neutral-800">
            {aiResult.improvedDescription}
          </p>
        </div>
      )}

      {/* Severity */}
      {aiResult.suggestedFaultSeverity && (
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Suggested Fault Severity
          </p>

          <p className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800">
            {aiResult.suggestedFaultSeverity}
          </p>
        </div>
      )}

      {/* Suggestions */}
      {aiResult.suggestions?.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Helpful Suggestions
          </p>

          <ul className="space-y-2">
            {aiResult.suggestions.map(
              (suggestion, index) => (
                <li
                  key={`${suggestion}-${index}`}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700"
                >
                  {suggestion}
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Apply */}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            if (aiResult.suggestedTitle) {
              setTitle(aiResult.suggestedTitle);
            }

            if (aiResult.improvedDescription) {
              setDescription(
                aiResult.improvedDescription
              );
            }

            if (aiResult.suggestedFaultSeverity) {
              setFaultSeverity(
                aiResult.suggestedFaultSeverity
              );
            }

            setAiResult(null);
            setAiError(null);
          }}
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
        >
          Apply AI Suggestions
        </button>

        <button
          type="button"
          onClick={() => setAiResult(null)}
          className="rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
        >
          Keep My Version
        </button>
      </div>
    </div>
  </div>
)}
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

          {/* AI Listing Assistant */}
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>

                  <h2 className="text-lg font-bold text-neutral-900">
                    AI Listing Assistant
                  </h2>
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                  Improve your listing title and description,
                  and get suggestions for information buyers
                  may need. AI suggestions are optional and
                  should be reviewed before applying them.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={aiLoading || submitting}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Improve with AI
                  </>
                )}
              </button>
            </div>

            {aiError && (
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{aiError}</span>
              </div>
            )}

            {aiResult && (
              <div className="mt-6 space-y-5 border-t border-neutral-100 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">
                      AI Suggestions
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      Review each suggestion before applying it.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={applyAISuggestions}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Apply All
                  </button>
                </div>

                {/* Suggested Title */}
                {aiResult.suggestedTitle && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                        Suggested Title
                      </p>

                      <button
                        type="button"
                        onClick={applyAITitle}
                        className="text-xs font-semibold text-neutral-900 hover:underline"
                      >
                        Apply
                      </button>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-neutral-900">
                      {aiResult.suggestedTitle}
                    </p>
                  </div>
                )}

                {/* Improved Description */}
                {aiResult.improvedDescription && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                        Improved Description
                      </p>

                      <button
                        type="button"
                        onClick={applyAIDescription}
                        className="text-xs font-semibold text-neutral-900 hover:underline"
                      >
                        Apply
                      </button>
                    </div>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-700">
                      {aiResult.improvedDescription}
                    </p>
                  </div>
                )}

                {/* Fault Severity */}
                {aiResult.suggestedFaultSeverity && (
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                          Suggested Fault Severity
                        </p>

                        <p className="mt-2 text-sm font-semibold text-neutral-900">
                          {aiResult.suggestedFaultSeverity}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={applyAIFaultSeverity}
                        className="text-xs font-semibold text-neutral-900 hover:underline"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Additional Suggestions */}
                {aiResult.suggestions?.length > 0 && (
                  <div className="rounded-xl border border-neutral-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">
                      Suggestions for Buyers
                    </p>

                    <ul className="mt-3 space-y-2">
                      {aiResult.suggestions.map(
                        (suggestion, index) => (
                          <li
                            key={`${suggestion}-${index}`}
                            className="flex items-start gap-2 text-sm leading-5 text-neutral-700"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                            <span>{suggestion}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}
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

{/* Seller Transaction Disclaimer */}
<section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
  <div className="mb-4">
    <h2 className="text-lg font-bold text-neutral-900">
      Seller Responsibility
    </h2>

    <p className="mt-1 text-sm text-neutral-500">
      Please review and acknowledge your responsibility
      for the information provided in this listing.
    </p>
  </div>

  <TransactionDisclaimer
    role="seller"
    checked={sellerDisclaimerAccepted}
    onChange={setSellerDisclaimerAccepted}
      disabled={submitting}
  />
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