import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'safe-moon-cycle',
  styleUrl: 'safe-moon-cycle.css',
})
export class SafeMoonCycle {
  @State() moonState = 'm100,0 a20,50 0 1,1 0,150 a20,21 0 1,1 0,-150';
  @State() date = Date.now();

  componentWillLoad() {
    setInterval(() => {
      this.date += 86400000 / 32;
      this.moonState = this.phase_junk(this.moon_day(new Date(this.date)));
    }, 5);
    console.log(Date.now());
    console.log('test moon comp');
    this.moonState = this.phase_junk(this.moon_day(new Date(this.date)));
  }

  addOneDay() {
    this.date += 86400000 / 8;
    this.moonState = this.phase_junk(this.moon_day(new Date(this.date)));
  }

  // http://www.ben-daglish.net/moon.shtml
  moon_day(today) {
    var GetFrac = function (fr) {
      return fr - Math.floor(fr);
    };
    var thisJD = today.getJulian();
    var year = today.getFullYear();
    var degToRad = 3.14159265 / 180;
    var K0, T, T2, T3, J0, F0, M0, M1, B1, oldJ;
    K0 = Math.floor((year - 1900) * 12.3685);
    T = (year - 1899.5) / 100;
    T2 = T * T;
    T3 = T * T * T;
    J0 = 2415020 + 29 * K0;
    F0 = 0.0001178 * T2 - 0.000000155 * T3 + (0.75933 + 0.53058868 * K0) - (0.000837 * T + 0.000335 * T2);
    M0 = 360 * GetFrac(K0 * 0.08084821133) + 359.2242 - 0.0000333 * T2 - 0.00000347 * T3;
    M1 = 360 * GetFrac(K0 * 0.07171366128) + 306.0253 + 0.0107306 * T2 + 0.00001236 * T3;
    B1 = 360 * GetFrac(K0 * 0.08519585128) + 21.2964 - 0.0016528 * T2 - 0.00000239 * T3;
    var phase = 0;
    var jday = 0;
    while (jday < thisJD) {
      var F = F0 + 1.530588 * phase;
      var M5 = (M0 + phase * 29.10535608) * degToRad;
      var M6 = (M1 + phase * 385.81691806) * degToRad;
      var B6 = (B1 + phase * 390.67050646) * degToRad;
      F -= 0.4068 * Math.sin(M6) + (0.1734 - 0.000393 * T) * Math.sin(M5);
      F += 0.0161 * Math.sin(2 * M6) + 0.0104 * Math.sin(2 * B6);
      F -= 0.0074 * Math.sin(M5 - M6) - 0.0051 * Math.sin(M5 + M6);
      F += 0.0021 * Math.sin(2 * M5) + 0.001 * Math.sin(2 * B6 - M6);
      F += 0.5 / 1440;
      oldJ = jday;
      jday = J0 + 28 * phase + Math.floor(F);
      phase++;
    }

    // 29.53059 days per lunar month
    return (thisJD - oldJ) / 29.53059;
  }

  phase_junk(phase) {
    var sweep = [];
    var mag;
    // the "sweep-flag" and the direction of movement change every quarter moon
    // zero and one are both new moon; 0.50 is full moon
    if (phase <= 0.25) {
      sweep = [1, 0];
      mag = 20 - 20 * phase * 4;
    } else if (phase <= 0.5) {
      sweep = [0, 0];
      mag = 20 * (phase - 0.25) * 4;
    } else if (phase <= 0.75) {
      sweep = [1, 1];
      mag = 20 - 20 * (phase - 0.5) * 4;
    } else if (phase <= 1) {
      sweep = [0, 1];
      mag = 20 * (phase - 0.75) * 4;
    }

    var unicode_moon;
    if (phase <= 0.0625 || phase > 0.9375) {
      unicode_moon = '\uD83C\uDF11';
    } else if (phase <= 0.1875) {
      unicode_moon = '\uD83C\uDF12';
    } else if (phase <= 0.3125) {
      unicode_moon = '\uD83C\uDF13';
    } else if (phase <= 0.4375) {
      unicode_moon = '\uD83C\uDF14';
    } else if (phase <= 0.5625) {
      unicode_moon = '\uD83C\uDF15';
    } else if (phase <= 0.6875) {
      unicode_moon = '\uD83C\uDF16';
    } else if (phase <= 0.8125) {
      unicode_moon = '\uD83C\uDF17';
    } else if (phase <= 0.9375) {
      unicode_moon = '\uD83C\uDF18';
    }

    console.log(unicode_moon)

    // http://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
    var d = 'm100,0 ';
    d = d + 'a' + mag + ',20 0 1,' + sweep[0] + ' 0,150 ';
    d = d + 'a20,20 0 1,' + sweep[1] + ' 0,-150';
    return d;
  }

  render() {
    return [
      this.moonState && (
        <div class="center-container">
          <svg width="200" height="150" >
            <defs>
              <mask id="mask-path" x="0" y="0" width="1" height="1">
                {/* <path class="moon" d="m100,0 a20,50 0 1,1 0,150 a20,21 0 1,1 0,-150"></path> */}
                {/* <rect x="0" y="0" width="210" height="210" fill="url(#gradient)"  />   */}

                <path class="moon" d={this.moonState}></path>
              </mask>
            </defs>

            {/* <image class="image-moon-2" xlinkHref="./assets/images/moon/toppng.com-moon-2000x1955.png" width="200" height="200"></image> */}
            <image class="image-moon-2" xlinkHref="./assets/images/moon/vangogh.png" width="200" height="200"></image>
            {/* <image class="image-sphere" xlinkHref="./assets/images/wireframe.png" width="202" height="202"/> */}
          </svg>
          <img class="image-moon" src="./assets/images/moon/vangogh.png" width="200" height="200"/>
        </div>
      ),
      // <ion-button onClick={()=>this.addOneDay()}>ADD 1/2 DAY</ion-button>
    ];
  }
}

// http://stackoverflow.com/questions/11759992/calculating-jdayjulian-day-in-javascript
// http://jsfiddle.net/gkyYJ/
// http://stackoverflow.com/users/965051/adeneo
Date.prototype['getJulian'] = function () {
  return this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.5;
};
