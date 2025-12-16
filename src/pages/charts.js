import { getCountries, getTopArtists, getTopVideos } from "../api/chartApi.js";
import { Header, initHeader } from "../components/layout/Header.js";
import { Sidebar, initSidebar } from "../components/layout/Sidebar.js";
import { formatNumber } from "../utils/utils.js";

export function ChartsPage() {
  return `
    <div class="bg-linear-to-b from-[#181818] via-[#0f0f0f] to-[#0f0f0f] text-white font-[Inter] ">
      <div id="overlay" class="fixed inset-0 bg-black/50 opacity-0 invisible transition-opacity duration-300 z-30 md:hidden"></div>
      ${Header()} ${Sidebar()} 
      <div id="mainContentWrapper" class="pt-16 md:ml-64 h-full ">
        <main id="mainContent" class="mt-10 ml-15 mr-15 pb-20">
          <div id="countryDropdownSection"></div>
          
          <section class="mb-12">
          <div class="flex justify-between">
            <h2 class="text-2xl font-bold mb-6">Bảng xếp hạng video</h2>
             <div class="flex gap-2">
              <button class="opacity-50 p-2 h-9.25 w-9.25 shrink-0 rounded-full border border-gray-700 hover:bg-gray-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
             </button>
             <button class="opacity-50 p-2 h-9.25 w-9.25 shrink-0  rounded-full border border-gray-700 hover:bg-gray-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
              </div>
              </div>
           <div>
             
            <div id="videoChartsContainer" class="flex gap-6 overflow-x-auto pb-4 text-gray-500">
          
            </div>
          </section>

          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold">Nghệ sĩ hàng đầu</h2>
              <div class="flex gap-2">
              <button class="opacity-50 p-2 rounded-full border border-gray-700 hover:bg-gray-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
             </button>
             <button class="opacity-50 p-2 rounded-full border border-gray-700 hover:bg-gray-800 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
              </div>
            </div>
            <div id="artistsListContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2 text-gray-500">
             
            </div>
          </section>
        </main>
      </div>
    </div>
  `;
}

export function initChartsPage() {
  initHeader();
  initSidebar();
  renderCountries();
  updateChartsByCountry("GLOBAL");
}

async function renderCountries() {
  const response = await getCountries();
  const countries = response.data.countries;
  const container = document.querySelector("#countryDropdownSection");
  if (!container) return;

  container.innerHTML = `
    <header class="mb-10 relative">
      <h1 class="text-4xl font-bold mb-6">Bảng xếp hạng</h1>
      <div class="relative inline-block text-left group">
        <button id="dropdownBtn" class="bg-[#222] hover:bg-[#333] px-4 py-2 rounded-full text-sm font-medium flex items-center justify-between transition min-w-[120px]">
          <span id="selectedCountryText">GLOBAL</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div id="countryDropdown" class="absolute left-0 mt-0 w-56 max-h-80 overflow-y-auto rounded-md shadow-lg bg-[#282828] z-50 hidden group-hover:block border border-white/10">
            ${countries
              .map(
                (country) => `
              <button class="country-option block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 border-t border-white/5" data-code="${
                country.code || country
              }">
                ${country.name || country}
              </button>
            `
              )
              .join("")}
        </div>
      </div>
    </header>
  `;
  setupCountrySelection();
}

function setupCountrySelection() {
  const options = document.querySelectorAll(".country-option");
  const selectedText = document.querySelector("#selectedCountryText");

  options.forEach((opt) => {
    opt.onclick = async (e) => {
      const code = e.currentTarget.getAttribute("data-code");
      const name = e.currentTarget.innerText;
      if (selectedText) selectedText.innerText = name;
      await updateChartsByCountry(code);
    };
  });
}

async function updateChartsByCountry(countryCode) {
  const artistContainer = document.querySelector("#artistsListContainer");
  const videoContainer = document.querySelector("#videoChartsContainer");

  // Render Artists
  const resArtists = await getTopArtists(countryCode);
  const artists = resArtists.data.items;

  console.log(artists[0].trend);

  if (artistContainer) {
    artistContainer.innerHTML = artists
      .map((artist) =>
        renderArtistItem(
          artist.rank,
          artist.name,
          `${formatNumber(artist.totalViews)} lượt xem`,
          artist.trend
        )
      )
      .join("");
  }

  // Render Videos
  const resVideos = await getTopVideos(countryCode);
  const videos = resVideos.data.items || [];
  if (videoContainer) {
    videoContainer.innerHTML = videos
      .map(
        (video) => `
      <div class="min-w-55 w-55 group cursor-pointer">
        <div class="aspect-square rounded-lg overflow-hidden relative mb-3">
          <img src="${video.thumb}" class="w-full h-full object-cover" alt="${
          video.title
        }">
        </div>
   
         <div class="flex">
            <h3 class="text-sm font-bold line-clamp-2">${video.artists}</h3>
            <p class="text-xs text-gray-400 mt-1 ml-auto">${formatNumber(
              video.views
            )}</p>
         </div>
    
      </div>
    `
      )
      .join("");
  }
}

function renderArtistItem(rank, name, views, status) {
  let statusIcon =
    status === "up"
      ? `<span class="text-green-500 text-[10px]">▲</span>`
      : status === "down"
      ? `<span class="text-red-500 text-[10px]">▼</span>`
      : `<span class="text-gray-500 text-[16px] leading-none">•</span>`;

  return `
    <div class="flex items-center py-2 hover:bg-white/5 px-2 rounded-md transition cursor-pointer group">
      <div class="">
         <span class="text-xl font-bold text-white ml-1">${rank}</span>
        ${statusIcon}
      </div>
      <div class="flex flex-col ml-4">
        <span class="text-sm font-bold text-white">${name}</span>
        <span class="text-xs text-gray-400">${views}</span>
      </div>
    </div>
  `;
}
