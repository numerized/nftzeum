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
        // console.log(item);

        if (item.nft_data) {
          item.nft_data = item.nft_data.filter(nftItem => nftItem.owner !== null);
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

        // console.log(this.raribleItems)
        // item.map(nft => {
        //   this.raribleItems.push(nft);
        // });
      }
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
    if (!this.sound.playing()) {
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
                VISIT PRANSKY's
              </ion-button>
              <br />
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
                          {/* <br />
                      <p>created by {item.creator.user.username}</p>
                      <p>owned by {item.top_ownerships[0].owner.user.username} </p>
                      <br /> */}
                          <ion-button class="visit-button" size="small" shape="round" color="dark" target="_blank" href={item.external_url}>
                          <svg width="20" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#FEDA03"></rect><path d="M27.6007 19.8536C28.8607 19.5262 29.9817 18.5838 29.9817 16.6889C29.9817 13.5342 27.3031 12.8 23.8706 12.8H10.2V27.0064H15.9539V22.185H22.7793C23.8309 22.185 24.446 22.6016 24.446 23.6334V27.0064H30.2V23.4548C30.2 21.5203 29.1087 20.3 27.6007 19.8536ZM22.8785 18.3556H15.9539V16.9667H22.8785C23.6325 16.9667 24.0888 17.0659 24.0888 17.6612C24.0888 18.2564 23.6325 18.3556 22.8785 18.3556Z" fill="black"></path></svg>&nbsp;&nbsp;Open On Rarible
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
