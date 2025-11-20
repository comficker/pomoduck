<script setup lang="ts">
import {formatFloat} from "~/lib/utils";

const {$sendHaptic} = useNuxtApp()
const store = useGlobalStore()

const tapping = ref(false)
const vibrating = ref(false)
const tabLevel = ref(0)
const amount = ref(1)

const isOpened = computed(() => {
  // return true
  return tabLevel.value === 5
})

const tap = () => {
  if (tapping.value) return;
  const audio = document.getElementById("audio");
  // @ts-ignore
  audio.play();
  tabLevel.value += 1
  tapping.value = true
  setTimeout(() => {
    tapping.value = false
  }, 200)
  if (tabLevel.value == 6) {
    tabLevel.value = 0
  }
}

const shake = () => {
  $sendHaptic()
  vibrating.value = true
  setTimeout(() => {
    vibrating.value = false
  }, 400)
}

const changeAmount = (n: number) => {
  const test = amount.value + n
  if (test < 1 || test > store.info.egg || test * 5 > store.info.footprint) {
    return
  }
  amount.value = test
}

useHead({
  title: "DuckLab",
  link: [
    {
      rel: "preload", href: "/sound.wav", as: "audio"
    }
  ]
})
</script>

<template>
  <div id="nest" class="h-full relative flex-1 overflow-hidden text-white content" @click="shake()">
    <div class="absolute -inset-[25%] md:-inset-[15%] center">
      <div class="pt-full w-full relative">
        <div id="bg" class="absolute inset-0"/>
      </div>
    </div>
    <div>
      <div class="absolute -bottom-4 -inset-x-[20%] md:-bottom-[30%] md:-inset-x-[35%]">
        <img class="mx-auto" src="/nest/ground.svg" alt="">
      </div>
      <div class="absolute top-4 right-4 flex gap-3">
        <div class="center text-black font-bold gap-2 bg-white py-1 px-4 rounded-xl shadow">
          <NuxtIcon filled name="footprint" class="size-4"/>
          <div>{{ formatFloat(store.info.footprint) }}</div>
        </div>
        <div class="center text-black font-bold gap-2 bg-white py-1 px-4 rounded-xl shadow">
          <NuxtIcon filled name="eggs" class="size-4"/>
          <div>{{ formatFloat(store.info.egg) }}</div>
        </div>
      </div>
      <div class="z-10 absolute inset-0 flex justify-center items-center">
        <template v-if="!isOpened">
          <div class="-z-10 absolute bottom-[25%] md:bottom-[30%]">
            <img class="mx-auto w-[90%]" src="/nest/ground-2.svg" alt="">
          </div>
          <div class="z-20 absolute bottom-[25%] md:bottom-[30%]">
            <img class="mx-auto w-[90%]" src="/nest/dust.svg" alt="">
          </div>
        </template>
        <div
            id="egg"
            :class="[{'tapped': vibrating }, `step-${tabLevel}`]"
            class="relative z-10 w-full xl:w-2/3 md:w-1/2"
        >
          <svg viewBox="0 0 1280 1280" version="1.1" xmlns="http://www.w3.org/2000/svg"
               xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs>
              <path d="M0,0 L1280,0 L1280,1280 L0,1280 L0,0 Z" id="path-1"></path>
              <path
                  d="M273.955391,124.070791 L264.241662,119.761028 L200.174169,129.473003 L59.4867925,0 L28.7765567,69.1242977 C28.7765567,69.1242977 8.15135136,119.592959 3.7795744,128.500604 C-0.592202555,137.408251 0.030625943,208.801478 0.030625943,208.801478 L3.7795744,269.55835 C3.7795744,269.55835 16.9068827,352.236197 21.2786597,366.642094 C25.6504366,381.047992 80.016178,441.180608 80.016178,441.180608 C80.016178,441.180608 118.140469,456.835016 118.763297,458.719788 C119.386125,460.604559 143.185361,474.074074 143.185361,474.074074 L205.839512,441.684814 L196.832454,376.858277 L240.885593,300.759123 L284.938732,300.759123 L269.212312,252.847509 L302.222222,217.120884 L273.943413,124.106807 L273.955391,124.070791 Z"
                  id="path-2"></path>
              <polygon id="path-4"
                       points="407.703704 59.6024268 368.740049 106.402966 329.824347 226.062892 254.822308 253.52288 245.435064 271.582044 247.593051 298.56301 234.848939 310.490681 204.948828 324.538028 214.65977 352.548894 204.948828 348.249663 140.820646 357.925926 0 228.769371 27.7421228 123.707669 101.365449 44.0461575 157.221348 14.0593227 203.845857 4.68244904 294.205572 0 365.515057 13.1132524"></polygon>
              <path
                  d="M427.851852,448.740209 L361.103599,484.740741 L357.944559,458.127476 L258.693019,417.649385 L210.923035,434.875383 L191.81264,376.847182 L119.202745,376.847182 L9.74137709,311.592467 L7.49521492,305.134219 L0,283.514693 L29.9568366,269.433791 L42.737139,257.47763 L40.5630462,230.432215 L49.9680994,212.329913 L125.112434,184.792327 L164.113977,64.8585777 L203.139543,17.9462472 L189.458374,2.86899871 L203.139543,0 L243.126034,17.9462472 L371.445555,137.591897 C371.445555,137.591897 402.47142,231.104449 412.332914,257.885772 C422.206418,284.65509 427.851852,448.740209 427.851852,448.740209 L427.851852,448.740209 Z"
                  id="path-6"></path>
              <polygon id="path-8"
                       points="478.390088 153.373652 379.338837 112.921217 331.665254 130.129402 312.593423 72.1207771 240.118068 72.1207771 128.012622 0 132.387995 13.9321502 159.179662 99.8770763 126.1426 135.589461 141.893943 183.481977 97.7925815 183.481977 53.7032072 259.550797 62.7176742 324.351495 0 356.727844 46.2351049 389.956203 74.3813395 406.804384 167.259118 412.444444 277.962047 405.868373 417.746221 357.807855 491.851852 266.870875"></polygon>
              <g id="egg_ref" transform="translate(-0, 0)">
                <path
                    d="M575.215182,422.749293 C568.693266,619.651665 436.5765,718.390264 277.796607,713.132987 C119.028702,707.887687 -6.27841483,600.646431 0.243501681,403.744059 C6.76541819,206.853664 142.634682,-5.14990545 301.414577,0.0953955247 C460.182482,5.3406965 581.737099,225.846923 575.215182,422.749293 Z"
                    id="Path" stroke="#000000" stroke-width="22.68" fill="#F9EDD4" fill-rule="nonzero"
                    stroke-linecap="round" stroke-linejoin="round"></path>
                <path
                    d="M538.24167,423.575608 C535.795951,497.860088 512.537646,560.133067 471.04435,603.67625 C432.656158,643.938127 379.653596,667.829395 317.755334,672.73938 C306.557779,673.625573 294.964593,673.889035 283.359418,673.493841 C213.021028,671.158604 153.424617,646.764363 111.056138,602.933765 C90.5192946,581.71305 74.6461007,556.300884 63.6643442,527.355924 C110.132999,564.108958 169.681454,584.036311 235.044485,586.191913 C389.688237,591.293508 518.364211,495.141632 524.718284,303.364806 C524.754251,302.478613 524.766239,301.604397 524.790217,300.706229 C534.812868,341.518982 539.56044,383.529292 538.229681,423.575608 L538.24167,423.575608 Z"
                    id="Path" fill="#F4D4AB" fill-rule="nonzero"></path>
                <path
                    d="M323.569911,86.3434722 C362.557544,87.6368341 399.327246,101.756035 432.572236,125.216183 C415.81187,103.22903 397.349092,84.6668921 378.143006,70.6674472 C349.921331,50.1053884 320.380885,39.1836658 290.360887,38.1896933 C285.289618,38.0220352 280.146415,38.1417909 275.063156,38.5489605 C217.852521,43.0877026 161.061495,83.26575 115.144325,151.682199 C74.0946151,212.853426 47.683251,288.383365 41.2092897,361.94931 C87.6899337,210.829554 198.622458,82.2118996 323.569911,86.3434722 L323.569911,86.3434722 Z"
                    id="Path" fill="#FFFFFF" fill-rule="nonzero"></path>
              </g>
            </defs>
            <g id="Frame" stroke="none" fill="none" fill-rule="evenodd">
              <g id="bl" stroke-width="1" transform="translate(293.9259, 489.4815)">
                <mask id="mask-3" fill="white">
                  <use xlink:href="#path-2"/>
                </mask>
                <g id="egg_wrap" mask="url(#mask-3)">
                  <g transform="translate(32.5577, -207.7927)">
                    <use xlink:href="#egg_ref"/>
                    <g class="cracks" transform="translate(40.6433, 50.4203)" stroke="#000000" stroke-width="12.07"
                       stroke-linecap="round">
                      <polyline
                          points="-2.84217094e-14 169.977585 126.985148 286.833422 191.77129 276.077019 309.905088 346.701931 382.320878 346.701931 401.377035 404.733688 449.011437 387.518641 525.044424 418.611369"></polyline>
                      <polyline
                          points="202.275532 285.849019 229.033203 374.469298 196.023292 410.195924 211.761689 458.107538 167.696574 458.107538 123.643435 534.20669 132.650492 599.033229 87.5672914 622.334769"></polyline>
                      <polyline
                          points="202.275532 285.849019 191.052642 253.36372 220.924455 239.281956 233.656506 227.325061 231.500562 200.277989 240.878921 182.174578 315.80998 154.647309 354.688852 34.6942029 383.482693 0"></polyline>
                    </g>
                  </g>
                </g>
              </g>
              <g id="tl" stroke-width="1" transform="translate(353.1852, 260.7407)">
                <mask id="mask-5" fill="white">
                  <use xlink:href="#path-4"/>
                </mask>
                <g id="egg_wrap" mask="url(#mask-5)">
                  <g transform="translate(-26.9665, 21.4965)">
                    <use xlink:href="#egg_ref"/>
                    <g class="cracks" transform="translate(40.6818, 50.297)" stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke="#000000" stroke-width="12.07">
                      <polyline
                          points="0 169.562138 127.105439 286.132366 191.952951 275.402252 310.198654 345.854548 382.683042 345.854548 401.75725 403.744468 449.436776 386.571496 525.541787 417.588231"></polyline>
                      <polyline
                          points="202.467143 285.150369 229.250161 373.554049 196.208981 409.193353 211.962286 456.987866 167.855429 456.987866 123.760559 532.901023 132.776149 597.569118 87.6502419 620.813704"></polyline>
                      <polyline
                          points="202.467143 285.150369 191.233621 252.744468 221.133732 238.697121 233.877844 226.769451 231.719858 199.788485 241.107102 181.72932 316.109141 154.269331 355.024841 34.609406 383.845958 0"></polyline>
                    </g>
                  </g>
                </g>
              </g>
              <g id="tr" stroke-width="1" transform="translate(558.2222, 302.2222)">
                <mask id="mask-7" fill="white">
                  <use xlink:href="#path-6"/>
                </mask>
                <g id="egg_wrap" mask="url(#mask-7)">
                  <g transform="translate(-232.3433, -20.2507)">
                    <use xlink:href="#egg_ref"/>
                    <g class="cracks" transform="translate(41.0216, 50.4172)" stroke-linejoin="round" stroke="#000000"
                       stroke-width="12.07">
                      <polyline
                          points="202.588628 285.8315 191.333794 253.348192 221.290631 239.26729 234.058921 227.311128 231.89684 200.265714 241.301894 182.163412 316.446228 154.63783 355.435759 34.6920764 384.311556 0"></polyline>
                      <polyline
                          points="0 169.707679 127.105439 286.277907 191.952951 275.547793 310.198654 346.000089 382.683042 346.000089 401.75725 403.890009 449.436776 386.717037 525.541787 417.733772"></polyline>
                    </g>
                  </g>
                </g>
              </g>
              <g id="br" stroke-width="1" transform="translate(437.3333, 606.8148)">
                <mask id="mask-9" fill="white">
                  <use xlink:href="#path-8"></use>
                </mask>
                <g id="egg_wrap" mask="url(#mask-9)">
                  <g transform="translate(-110.7187, -324.8431)">
                    <use xlink:href="#egg_ref"/>
                    <g class="cracks" transform="translate(40.6767, 50.4001)" stroke-linecap="round"
                       stroke-linejoin="round"
                       stroke="#000000" stroke-width="12.07">
                      <polyline
                          points="2.84217094e-14 169.909831 127.089599 286.719089 191.929029 275.966974 310.159997 346.563734 382.635352 346.563734 401.707183 404.57236 449.380766 387.364174 525.476293 418.444509"></polyline>
                      <polyline
                          points="202.441912 285.735079 229.221591 374.320034 196.184529 410.032418 211.935871 457.924935 167.834509 457.924935 123.745136 533.993755 132.759603 598.794453 87.6393189 622.086703"></polyline>
                      <polyline
                          points="202.441912 285.735079 191.20979 253.262729 221.106174 239.186577 233.848698 227.234448 231.69098 200.198158 241.077054 182.101962 316.069747 154.585666 354.980598 34.6803737 383.798122 0"></polyline>
                    </g>
                  </g>
                </g>
              </g>
              <g id="broking" transform="translate(367.2914, 332.3887)">
                <polyline
                    class="broking_1" stroke="#000000" stroke-width="12.07" stroke-linecap="round"
                    stroke-linejoin="round"
                    points="202.197663 285.8315 190.942829 253.348192 220.899666 239.26729 233.667956 227.311128 231.505875 200.265714 240.910929 182.163412 316.055263 154.63783 355.044794 34.6920764 383.92059 0"></polyline>
                <polyline
                    class="broking_2" stroke="#000000" stroke-width="12.07" stroke-linecap="round"
                    stroke-linejoin="round"
                    points="0 169.892965 127.089599 286.702223 191.929029 275.950108 310.159996 346.546868 382.635352 346.546868 401.707182 404.555494 449.380767 387.347308 525.476293 418.427643"></polyline>
                <polygon
                    class="broking_3" fill="#000000" fill-rule="nonzero"
                    points="191.20979 277.006119 220.482833 363.551052 273.610649 376.379191 291.411823 395.471396 337.179423 381.04724 330.826142 350.074906 309.632555 350.074906"></polygon>
                <polyline
                    class="broking_3" stroke="#000000" stroke-width="12.07" stroke-linecap="round"
                    stroke-linejoin="round"
                    points="202.441912 285.718213 229.221592 374.303168 196.184529 410.015552 211.935872 457.908069 167.83451 457.908069 123.745135 533.976889 132.759603 598.777587 87.6393188 622.069838"></polyline>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div v-if="isOpened" id="result" class="z-20 absolute inset-0 center" style="background: #ffbf2c">
      <div class="pt-full relative my-auto w-full">
        <div class="animate-scale absolute inset-0 rounded-full" style="background: #ffb027;--scale: 100%;"/>
        <div
            class="animate-scale absolute inset-0 rounded-full scale-75"
            style="background: #ffbf2c;--scale: 75%;"
        />
        <div
            class="animate-scale absolute inset-0 rounded-full scale-55"
            style="background: #ffb027;--scale: 50%;"
        />
        <div class="absolute inset-0 flex items-center justify-center">
          <NuxtIcon id="duck-born" name="skin/base" class="size-48 md:size-64" filled/>
        </div>
      </div>
    </div>
    <div
        class="z-20 absolute p-4 bottom-0 md:bottom-16 gap-3 inset-x-0 flex md:grid md:grid-cols-3 md:text-lg"
        :class="{'grid-cols-2': !isOpened, 'center': isOpened}"
    >
      <div v-if="!isOpened">
        <div class="inline-flex! center py-2.5 px-4 gap-2 rounded-full bg-white text-black">
          <NuxtIcon name="minus" class="size-6 cursor-pointer" @click="changeAmount(-1)"/>
          <div class="center gap-0.5 w-8">
            <nuxt-icon name="egg" filled class="size-4"/>
            <div class="text-lg text-center font-bold">{{ amount }}</div>
          </div>
          <NuxtIcon name="plus" class="size-6 cursor-pointer" @click="changeAmount(1)"/>
        </div>
      </div>
      <div class="flex-1 center">
        <template v-if="!isOpened">
          <div class="knock center gap-1 duration-100" :class="{knocking: tapping}" @click="tap">
            <span class="text-[#E69B36]">Crack</span>
            <NuxtIcon v-for="i in 5" name="footprint" :filled="i <= tabLevel" class="size-4"/>
          </div>
        </template>
        <div v-else class="w-1/2 receive" @click="tabLevel = 0">Receive</div>
      </div>
    </div>
  </div>
  <audio id="audio" src="/sound.wav"/>
</template>

<style scoped>
.knock {
  padding: 12px 24px;
  box-shadow: 0 8px 0 0 #000000;
  background-color: #4A4A4A;
  border-radius: 50px;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
}

.receive {
  padding: 12px 16px;
  box-shadow: 0 8px 0 0 #ffffff;
  background-color: #000000;
  border-radius: 50px;
  text-transform: uppercase;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
}

.knock.knocking {
  box-shadow: none;
  transform: translateY(8px);
}

#nest,
#bg {
  background-color: #e5e5e5;
}

#bg:before,
#bg:after {
  content: "";
  position: absolute;
  border-radius: 50%;
}

#bg:before {
  inset: 10%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, #ededed 100%);
}

#bg:after {
  inset: 25%;
  background: radial-gradient(50% 50% at 50% 50%, rgba(255, 255, 255, 0) 0%, #eeeeee 100%);
}

#egg.tapped {
  animation: shake 0.5s;
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -2px) rotate(-1deg);
  }
  20% {
    transform: translate(-3px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(3px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 2px) rotate(-1deg);
  }
  60% {
    transform: translate(-3px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-1px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}

.cracks {
  opacity: 0;
}

.step-4 .cracks,
.step-5 .cracks {
  opacity: 1;
}

/* Start animation. */
@keyframes bl_move_intro {
  0% {
    transform: translate(282px, 493px) rotate(1deg);
  }
  20% {
    transform: translate(286px, 494px) rotate(1deg);
  }
  40% {
    transform: translate(281px, 495px) rotate(1deg);
  }
  60% {
    transform: translate(285px, 495px) rotate(1deg);
  }
  80% {
    transform: translate(282px, 494px) rotate(1deg);
  }
  100% {
    transform: translate(281px, 499px) rotate(2deg);
  }
}

@keyframes bl_move {
  0% {
    transform: translate(292px, 483px) rotate(1deg);
  }
  100% {
    transform: translate(-100%, 100%) rotate(500deg);
    opacity: 0;
  }
}

@keyframes tl_move_intro {
  0% {
    transform: translate(342px, 253px) rotate(1deg);
  }
  20% {
    transform: translate(344px, 252px) rotate(2deg);
  }
  40% {
    transform: translate(342px, 255px) rotate(1deg);
  }
  60% {
    transform: translate(342px, 251px) rotate(2deg);
  }
  80% {
    transform: translate(341px, 253px) rotate(0deg);
  }
  100% {
    transform: translate(345px, 252px) rotate(1deg);
  }
}

@keyframes tl_move {
  0% {
    transform: translate(353px, 261px) rotate(0deg);
  }
  100% {
    transform: translate(-100%, -100%) rotate(250deg);
    opacity: 0;
  }
}

@keyframes tr_move_intro {
  0% {
    transform: translate(561px, 293px) rotate(1deg);
  }
  20% {
    transform: translate(562px, 292px) rotate(2deg);
  }
  40% {
    transform: translate(566px, 298px) rotate(1deg);
  }
  60% {
    transform: translate(562px, 291px) rotate(2deg);
  }
  80% {
    transform: translate(566px, 295px) rotate(0deg);
  }
  100% {
    transform: translate(565px, 291px) rotate(1deg);
  }
}

@keyframes tr_move {
  0% {
    transform: translate(558px, 302px) rotate(0deg);
  }
  100% {
    transform: translate(100%, -100%) rotate(-250deg);
    opacity: 0;
  }
}

@keyframes br_move_intro {
  0% {
    transform: translate(452px, 623px) rotate(1deg);
  }
  20% {
    transform: translate(453px, 622px) rotate(2deg);
  }
  40% {
    transform: translate(451px, 625px) rotate(1deg);
  }
  60% {
    transform: translate(452px, 622px) rotate(2deg);
  }
  80% {
    transform: translate(453px, 623px) rotate(0deg);
  }
  100% {
    transform: translate(456px, 621px) rotate(1deg);
  }
}

@keyframes br_move {
  0% {
    transform: translate(437px, 601px);
  }
  100% {
    transform: translate(100%, 100%) rotate(95deg);
    opacity: 0;
  }
}

#bl {
  transform: translate(296px, 486px);
}

#tl {
  transform: translate(353px, 261px) rotate(0deg);
}

#tr {
  transform: translate(558px, 302px);
}

#br {
  transform: translate(437px, 601px);
}

.step-4 #bl {
}

.step-4 #tl {

}

.step-4 #tr {

}

.step-4 #br {
  transform: translate(452px, 623px) rotate(1deg);
}

.step-5 #bl {
  animation: bl_move_intro 300ms infinite, bl_move 1s forwards 800ms;
}

.step-5 #tl {
  animation: tl_move_intro 300ms infinite, tl_move 1s forwards 800ms;
}

.step-5 #tr {
  animation: tr_move_intro 300ms infinite, tr_move 1s forwards 800ms;
}

.step-5 #br {
  animation: br_move_intro 300ms infinite, br_move 1s forwards 800ms;
}

/* End animation. */

.broking_1,
.broking_2,
.broking_3 {
  opacity: 0;
}

.step-1 .broking_1 {
  opacity: 1;
}

.step-2 .broking_1,
.step-2 .broking_2 {
  opacity: 1;
}

.step-3 .broking_1,
.step-3 .broking_2,
.step-3 .broking_3 {
  opacity: 1;
}

@keyframes scale {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(var(--scale));
  }
}

.animate-scale {
  animation: scale 400ms forwards;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

#result {
  opacity: 0;
  z-index: 11;
  animation: fade 2000ms forwards 800ms;
}

.receive,
#duck-born {
  opacity: 0;
  animation: fade 400ms forwards 1000ms;
}
</style>
