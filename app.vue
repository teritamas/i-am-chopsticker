<template>
  <Loading v-if="isLoading" />
  <div
    class="h-screen w-screen bg-indigo-400 overflow-hidden absolute flex items-center"
  >
    <div
      class="w-screen h-64 absolute top-0 opacity-50 left-0 -my-40 -mx-64 bg-indigo-300 rounded-full"
    ></div>
    <div class="w-64 h-64 -mx-32 bg-indigo-300 opacity-50 rounded-full"></div>
    <div
      class="w-64 h-64 ml-auto relative opacity-50 -mr-32 bg-indigo-300 rounded-full"
    ></div>
    <div
      class="w-screen h-64 absolute opacity-50 bottom-0 right-0 -my-40 -mx-64 bg-indigo-300 rounded-full"
    ></div>
  </div>

  <div class="container mx-auto h-screen py-16 px-8 relative">
    <div
      class="flex max-w-screen-sm mx-auto rounded-lg h-full overflow-auto flex-col"
    >
      <div class="max-w-screen-sm bg-white text-gray-800 flex flex-col">
        <div class="p-8 shadow-md relative bg-white">
          <div class="flex items-center">
            <div class="text-indigo-600 font-medium">I am chopsticker</div>
            <!--<button
              class="bg-indigo-100 text-indigo-400 ml-auto w-8 h-8 flex items-center justify-center rounded"
            >
              <svg
                stroke="currentColor"
                class="w-4 h-4"
                viewBox="0 0 24 24"
                stroke-width="2.2"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                />
              </svg>
            </button>-->
          </div>
          <h1 class="font-medium text-lg mt-6">写真を追加してください</h1>
          <p class="text-gray-600 text-sm">
            If you take a photo, I'll show you how to use chopsticks correctly!
          </p>
          <div class="mt-6 flex">
            <div class="relative ml-auto flex-1">
              <div class="flex items-center justify-center w-full">
                <label
                  v-if="!file?.size"
                  for="dropzone-file"
                  class="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div
                    class="flex flex-col items-center justify-center pt-5 pb-6"
                  >
                    <svg
                      class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span class="font-semibold">Click to upload</span> or drag
                      and drop
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    class="hidden"
                    type="file"
                    @change="handleFileUpload"
                  />
                </label>
                <img
                  v-if="file?.size"
                  :src="fileUrl"
                  class="h-auto max-w-lg rounded-lg"
                  alt="アップロードされた画像のプレビュー"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-if="mannerImages" class="overflow-auto flex-grow">
          <div
            class="bg-gray-100 px-8 py-6 flex items-center border-b border-gray-300"
            v-for="mannerImage in mannerImages"
            :key="mannerImage.key"
          >
            <div class="flex ml-4">
              <img
                src="@/assets/img/master_icon.jpg"
                class="w-10 h-10 object-cover rounded object-top"
              />
              <div class="flex flex-col pl-4">
                <h2 class="font-medium text-sm">chopsticks master</h2>
                <h3 class="text-gray-500 text-sm">
                  {{ mannerImage.manner }}
                </h3>
                <img
                  :src="mannerImage.imageUrl"
                  class="max-w-sm mt-3 rounded-lg"
                />
              </div>
            </div>
            <!--<button
              class="text-gray-500 flex items-center text-sm focus:outline-none rounded ml-auto py-2 leading-none"
            >
              <svg
                class="w-4 h-4 mr-2"
                viewBox="0 0 640 512"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"
                />
              </svg>
            </button>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  MannerItem,
  PostBookResponse,
} from "./server/models/book/response";

const isLoading = ref(false);
const file = ref<File | null>(null);
const fileUrl = ref("");
let mannerImages = ref([] as MannerItem[]);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length) {
    file.value = files[0];
    fileUrl.value = URL.createObjectURL(files[0]);
  }
  isLoading.value = true;
  makeManner();
};

const makeManner = async () => {
  if (!file.value) {
    console.error("No file selected");
    return;
  }
  const formData = new FormData();
  formData.append("file", file.value);

  try {
    const response = await fetch("/api/book", {
      method: "POST",
      body: formData,
    });
    // PostBookResponseの型でレスポンスを受け取る

    const responseData = (await response.json()) as PostBookResponse; // レスポンスをJSON形式で解析
    // stepでソート
    // mannerImagesにイメージ情報を設定
    const list = responseData.list;
    list.sort((a, b) => a.step - b.step);
    mannerImages.value = list;
    isLoading.value = false;
  } catch (error) {
    console.error("Error uploading photo:", error);
  }
};
</script>
