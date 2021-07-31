import { Component, h, State, Element, Prop } from '@stencil/core';
import { CovalentAPI } from '../../services/covalent-api';
import { Howl } from 'howler';

import * as pranksyWallet from '../../json/pranksy.json';

import { RateLimit } from 'async-sema';

// configure a limit of maximum 5 requests / second
const limit = RateLimit(0.1);

@Component({
  tag: 'app-gallery',
  styleUrl: 'app-gallery.css',
})
export class AppGallery {
  private slideOpts = {
    initialSlide: 0,
    loop: true,
    grabCursor: true,
    // speed: 400,
  };

  private sound;

  @State() musicPause = false;
  @State() music;
  @State() images = [];
  @State() nftCounter = null;
  @State() totalNftCount = 0;
  @State() activeSlideIndex = 0;
  @State() raribleItems = [];
  @Prop() slidesComponent;

  @Element() el: HTMLElement;

  async componentDidLoad() {
    this.slidesComponent = this.el.querySelector('ion-slides');

    let tokenBalancesBSC = await CovalentAPI.getTokenBalances('0x796fc008cC6c051D84C9D5A7181DD5F0153AbA2c', 56, false);

    tokenBalancesBSC.data.items.forEach(token => {
      token.nft_data &&
        fetch(token.nft_data[0].token_url)
          .then(res => res.json())
          .then(out => {
            this.music = out.properties;
            console.log(this.music);
            this.sound = new Howl({
              src: [this.music.playUrl],
              html5: true,
            });
          })
          .catch(err => {
            throw err;
          });
    });

    // let tokenBalancesETH = await CovalentAPI.getTokenBalances('0x796fc008cC6c051D84C9D5A7181DD5F0153AbA2c', 1, false);
    // console.log(pranksyWallet['data']['items'])

    pranksyWallet['data']['items'].map(async item => {
      if (item.contract_name === 'Rarible') {
        console.log(item);

        if (item.nft_data) {
          item.nft_data = item.nft_data.filter(nftItem => nftItem.owner !== null);
          console.log(item.nft_data)
          this.totalNftCount += item.nft_data.length;
          for (let i = 0; i < item.nft_data.length; i++) {
            await limit();
            fetch(`https://api.covalenthq.com/v1/1/tokens/${item.contract_address}/nft_metadata/${item.nft_data[i].token_id}/?format=json&key=ckey_79709e01a4a049a4aa31effc66e`)
              .then(res => res.json())
              .then(out => {
                if (out && out.data.items[0].nft_data[0].external_data) {
                  this.images.push(out.data.items[0].nft_data[0].external_data);
                  this.images = [...this.images];
                  this.nftCounter++;
                }
                //   this.slidesComponent.update();
              })
              .catch(err => {
                throw err;
              });
          }
        }
      }

      if (item.contract_name === 'OpenSea Shared Storefront') {
        // console.log(item);

        if (item.nft_data) {
          // item.nft_data = item.nft_data.filter(nftItem => nftItem.owner !== null);
          this.totalNftCount += item.nft_data.length;
          for (let i = 0; i < item.nft_data.length; i++) {
            await limit();
            fetch(`https://api.covalenthq.com/v1/1/tokens/${item.contract_address}/nft_metadata/${item.nft_data[i].token_id}/?format=json&key=ckey_79709e01a4a049a4aa31effc66e`)
              .then(res => res.json())
              .then(out => {
                console.log('out', out);
                if (out && out.data.items[0].nft_data[0].external_data) {
                  this.images.push(out.data.items[0].nft_data[0].external_data);
                  this.images = [...this.images];
                  this.nftCounter++;
                }
                //   this.slidesComponent.update();
              })
              .catch(err => {
                throw err;
              });
          }
        }
      }

      // console.log(this.raribleItems)
      // item.map(nft => {
      //   this.raribleItems.push(nft);
      // });
    });

    console.log(this.raribleItems);

    // let tokenBalancesETHPranksy = await CovalentAPI.getTokenBalances('0xD387A6E4e84a6C86bd90C158C6028A58CC8Ac459', 1, true);
    // console.log(tokenBalancesETHPranksy)

    // tokenBalancesETH.data.items.forEach(token => {
    //   if (token.nft_data) {
    //     console.log(token.nft_data);
    //     this.totalNftCount = token.nft_data.length;
    //   }
    //   token.nft_data &&
    //     token.nft_data.forEach(async item => {
    //       await limit();
    //       fetch(`https://api.opensea.io/api/v1/asset/0x495f947276749Ce646f68AC8c248420045cb7b5e/${item.token_id}`)
    //         .then(res => res.json())
    //         .then(out => {
    //           console.log('Checkout this OPENSEA JSON! ', out);
    //           this.images.push(out);
    //           this.images = [...this.images];
    //           this.nftCounter++;
    //           console.log(this.images);
    //         })
    //         .catch(err => {
    //           throw err;
    //         });
    //     });
    // });
  }

  async nextSlide() {
    if (!this.sound.playing() && !this.musicPause) {
      this.sound.play();
    }
    this.slidesComponent.slideNext();
    this.activeSlideIndex = await this.slidesComponent.getActiveIndex();
    this.slidesComponent.slideNext();
    this.activeSlideIndex = await this.slidesComponent.getActiveIndex();
  }

  async previousSlide() {
    this.slidesComponent.slidePrev();
    this.activeSlideIndex = await this.slidesComponent.getActiveIndex();
  }

  playPausePlayer() {
    if (!this.sound.playing()) {
      this.sound.play();
    } else {
      this.musicPause = true;
      this.sound.pause();
    }
  }

  render() {
    return [
      <ion-content>
        <ion-slides pager={false} options={this.slideOpts}>
          <ion-slide>
            <div class="bg-class-original"></div>
            <div class="bg-text">
              <br />
              <br />
              <h1 class="grunge-font ion-no-margin">NFTzeum.eth</h1>
              <br />
              <h4 class="charlotte-font ion-no-margin">yet Another Shrine of the Muses</h4>
              <br />
              <br />
              <ion-button onClick={() => this.nextSlide()} size="large" color="dark" shape="round">
                SEE PRANSKY's NFTs
              </ion-button>
              <br />
              <br />
              <br />
              <ion-row>
                <ion-col></ion-col>
                <ion-col></ion-col>
                <ion-col>
                  <img class="logos" src="/assets/images/Apple_logo_black.svg.png" />
                </ion-col>
                <ion-col>
                  <img class="logos" src="/assets/images/1600px-Logo_Oculus_horizontal.svg.png" />
                </ion-col>
                <ion-col>
                  <img class="logos" src="/assets/images/android-logo-svgrepo-com.svg" />
                </ion-col>
                <ion-col>
                  <img
                    class="logos"
                    src="/assets/images/kisspng-steam-link-logo-video-games-smart-puzzle-steam-2-17-k-ndirimleri-balad-the-whit-5b7e65440bb4f1.298961591535010116048.png"
                  />
                </ion-col>
                <ion-col></ion-col>
                <ion-col></ion-col>
              </ion-row>
              <br />
              <ion-row class="center-container">
                <p>NFT Music powered by</p>
              </ion-row>
              <ion-row class="center-container">
                <a href="https://rocki.app/nft" target="_blank">
                  <div class="logo-rocki-container">
                    <svg class="logo-rocki" width="442" height="138" viewBox="0 0 442 138" fill="none">
                      <path
                        d="M123.353 0H16C7.16344 0 0 7.16344 0 16V122C0 130.837 7.16344 138 16 138H123.353C132.19 138 139.353 130.837 139.353 122V16C139.353 7.16344 132.19 0 123.353 0Z"
                        fill="#E31D38"
                      ></path>
                      <path
                        data-v-e7c0ecf0=""
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M48.7056 25.7057H60.882V108.235H48.7056V25.7057ZM33.8232 75.7646H45.9997V102.823H33.8232V75.7646ZM75.7644 64.9411H63.588V113.647H75.7644V64.9411ZM78.4703 70.3528H90.6468V108.235H78.4703V70.3528ZM105.529 41.9411H93.3526V102.823H105.529V41.9411Z"
                        fill="#FFFAFA"
                      ></path>
                      <path
                        data-v-e7c0ecf0=""
                        d="M392.952 28.4811C393.002 28.4364 393.066 28.4117 393.133 28.4117H417.347C417.596 28.4117 417.713 28.7193 417.527 28.8846L378.914 63.1906C378.857 63.2419 378.824 63.3155 378.824 63.3929V68.5112C378.824 68.5894 378.857 68.6638 378.916 68.7152L417.514 102.349C417.703 102.513 417.587 102.824 417.336 102.824H393.133C393.066 102.824 393.002 102.799 392.952 102.754L364.031 76.7595C363.974 76.7081 363.941 76.635 363.941 76.5582V54.677C363.941 54.6003 363.974 54.5271 364.031 54.4758L392.952 28.4811Z"
                        fill="white"
                      ></path>
                      <path data-v-e7c0ecf0="" d="M424.824 28.4117H442V104.176H424.824V28.4117Z" fill="white"></path>
                      <path
                        data-v-e7c0ecf0=""
                        d="M193.849 102.824H175.98V31.0636H193.146V43.7271C193.146 46.4005 192.865 48.6518 192.865 48.6518H193.146C196.382 38.521 205.106 30.0786 215.94 30.0786C217.066 30.0786 218.192 30.2193 219.317 30.36V47.9483C218.614 47.8076 216.503 47.6669 214.955 47.6669C200.322 47.6669 193.849 60.3304 193.849 73.8381V102.824Z"
                        fill="white"
                      ></path>
                      <path
                        data-v-e7c0ecf0=""
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M259.664 104.512C237.854 104.512 220.266 89.0344 220.266 66.9436C220.266 44.9934 237.854 29.3751 259.523 29.3751C281.473 29.3751 299.061 44.9934 299.061 66.9436C299.061 89.0344 281.473 104.512 259.664 104.512ZM259.664 44.5713C247.985 44.5713 238.417 53.7172 238.417 66.9436C238.417 80.3106 247.985 89.3158 259.664 89.3158C271.342 89.3158 281.051 80.3106 281.051 66.9436C281.051 53.7172 271.342 44.5713 259.664 44.5713Z"
                        fill="white"
                      ></path>
                      <path
                        data-v-e7c0ecf0=""
                        d="M342.791 104.512C319.012 104.512 303.815 87.768 303.815 66.9436C303.815 46.5412 319.012 29.3751 342.791 29.3751C352.377 29.3751 363.199 32.5303 370.107 39.7889L359.804 50.1014C355.417 46.7866 349.597 44.5713 343.776 44.5713C330.55 44.5713 321.967 54.5614 321.967 66.8029C321.967 78.9036 330.55 89.3158 344.339 89.3158C350.337 89.3158 356.686 86.8607 361.724 83.2655L371.82 93.3708C365.018 100.234 354.038 104.512 342.791 104.512Z"
                        fill="white"
                      ></path>
                      <path
                        data-v-e7c0ecf0=""
                        d="M377 138V118H383.812C385.105 118 386.206 118.124 387.116 118.373C388.035 118.622 388.786 118.977 389.369 119.438C389.96 119.899 390.393 120.457 390.666 121.112C390.939 121.767 391.075 122.504 391.075 123.325C391.075 123.795 391.007 124.247 390.87 124.68C390.734 125.105 390.52 125.506 390.229 125.884C389.947 126.253 389.583 126.589 389.137 126.893C388.7 127.198 388.176 127.456 387.567 127.668C390.279 128.286 391.635 129.77 391.635 132.122C391.635 132.97 391.476 133.754 391.157 134.473C390.838 135.192 390.374 135.815 389.765 136.34C389.155 136.857 388.404 137.262 387.512 137.557C386.62 137.852 385.601 138 384.454 138H377ZM380.672 129.231V135.095H384.399C385.082 135.095 385.651 135.012 386.106 134.846C386.57 134.68 386.939 134.459 387.212 134.183C387.494 133.906 387.694 133.583 387.812 133.214C387.94 132.846 388.003 132.454 388.003 132.039C388.003 131.605 387.935 131.218 387.799 130.877C387.662 130.527 387.448 130.231 387.157 129.992C386.866 129.743 386.493 129.554 386.038 129.425C385.583 129.296 385.032 129.231 384.386 129.231H380.672ZM380.672 126.658H383.608C384.854 126.658 385.801 126.428 386.447 125.967C387.093 125.506 387.416 124.773 387.416 123.768C387.416 122.726 387.125 121.983 386.543 121.541C385.96 121.098 385.05 120.877 383.812 120.877H380.672V126.658Z"
                        fill="#FEFEFE"
                      ></path>
                      <path data-v-e7c0ecf0="" d="M407.235 118V120.96H398.484V126.506H405.379V129.369H398.484V135.026H407.235V138H394.785V118H407.235Z" fill="#FEFEFE"></path>
                      <path data-v-e7c0ecf0="" d="M424.321 118V121.057H418.383V138H414.71V121.057H408.744V118H424.321Z" fill="#FEFEFE"></path>
                      <path
                        data-v-e7c0ecf0=""
                        d="M442 138H439.16C438.842 138 438.578 137.922 438.369 137.765C438.168 137.599 438.023 137.396 437.932 137.156L436.457 133.076H428.28L426.805 137.156C426.733 137.368 426.587 137.562 426.369 137.737C426.159 137.912 425.9 138 425.59 138H422.737L430.491 118H434.246L442 138ZM429.222 130.448H435.515L433.113 123.795C433.003 123.5 432.881 123.154 432.744 122.758C432.617 122.352 432.489 121.914 432.362 121.444C432.234 121.914 432.107 122.352 431.979 122.758C431.861 123.164 431.743 123.519 431.625 123.823L429.222 130.448Z"
                        fill="#FEFEFE"
                      ></path>
                    </svg>
                  </div>
                </a>
              </ion-row>
            </div>
          </ion-slide>

          {this.images &&
            this.images.map(
              item =>
                item.image && (
                  <ion-slide>
                    <div class="bg-class-original"></div>
                    <div class="bg-text">
                      <ion-row>
                        <ion-col>
                          <img src={item.image} />
                        </ion-col>
                        <ion-col>
                          <br />
                          <br />
                          <br />
                          <h1 class="grunge-font ion-no-margin">{item && item.name}</h1>
                          <p class="description ion-padding">{item && item.description}</p>
                          <ion-button class="visit-button" size="small" shape="round" color="dark" target="_blank" href={item.external_url}>
                            <svg width="20" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="40" height="40" rx="8" fill="#FEDA03"></rect>
                              <path
                                d="M27.6007 19.8536C28.8607 19.5262 29.9817 18.5838 29.9817 16.6889C29.9817 13.5342 27.3031 12.8 23.8706 12.8H10.2V27.0064H15.9539V22.185H22.7793C23.8309 22.185 24.446 22.6016 24.446 23.6334V27.0064H30.2V23.4548C30.2 21.5203 29.1087 20.3 27.6007 19.8536ZM22.8785 18.3556H15.9539V16.9667H22.8785C23.6325 16.9667 24.0888 17.0659 24.0888 17.6612C24.0888 18.2564 23.6325 18.3556 22.8785 18.3556Z"
                                fill="black"
                              ></path>
                            </svg>
                            &nbsp;&nbsp;Open On Rarible
                          </ion-button>
                          <br />
                        </ion-col>
                      </ion-row>
                    </div>
                  </ion-slide>
                ),
            )}
        </ion-slides>
      </ion-content>,
      <ion-footer>
        {/* {this.activeSlideIndex > 0 && ( */}
        <ion-toolbar>
          <ion-row>
            <ion-col>
              <ion-button size="large" shape="round" color="dark" onClick={() => this.previousSlide()}>
                PREVIOUS
              </ion-button>
            </ion-col>
            <ion-col class="ion-text-end music-image">
              {this.music && <img class="music-image" src={this.music.image} />}
              <div class="mini-logo-rocki-container">
                <svg class="mini-logo-rocki" width="138" height="138" viewBox="0 0 138 138" fill="none">
                  <path
                    d="M123.353 0H16C7.16344 0 0 7.16344 0 16V122C0 130.837 7.16344 138 16 138H123.353C132.19 138 139.353 130.837 139.353 122V16C139.353 7.16344 132.19 0 123.353 0Z"
                    fill="#E31D38"
                  ></path>
                  <path
                    data-v-e7c0ecf0=""
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M48.7056 25.7057H60.882V108.235H48.7056V25.7057ZM33.8232 75.7646H45.9997V102.823H33.8232V75.7646ZM75.7644 64.9411H63.588V113.647H75.7644V64.9411ZM78.4703 70.3528H90.6468V108.235H78.4703V70.3528ZM105.529 41.9411H93.3526V102.823H105.529V41.9411Z"
                    fill="#FFFAFA"
                  ></path>
                </svg>
              </div>
              {this.sound && (
                <ion-button fill="clear" size="large" shape="round" color="dark" onClick={() => this.playPausePlayer()}>
                  {!this.sound.playing() && <ion-icon name="play-outline"></ion-icon>}
                  {this.sound.playing() && <ion-icon name="pause-outline"></ion-icon>}
                </ion-button>
              )}
            </ion-col>
            {this.sound && this.music && (
              <ion-col>
                <h3 class="ion-no-margin ion-no-padding music-title">
                  <b>{this.music.title}</b>
                </h3>
                <p class="ion-no-margin ion-no-padding">{this.music.artist}</p>
              </ion-col>
            )}
            <ion-col class="ion-text-right">
              <ion-button size="large" shape="round" color="dark" onClick={() => this.nextSlide()}>
                NEXT
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-toolbar>
        {/* )} */}
      </ion-footer>,
      <h1 class="ion-text-center pagination">
        {this.activeSlideIndex} / {this.nftCounter}
      </h1>,
    ];
  }
}
