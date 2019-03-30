import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  constructor(
    private geolocation: Geolocation,
    public loadingController: LoadingController,
    private router: Router
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Please wait...',
      translucent: true,
    });
    loading.present().then(() => {
      this.getLocation().then((res) => {
        console.log(res);
        this.loadMapInfo(res).then((val) => {
          console.log(val);
        }).catch((e) => {
          console.log(e);
        });
        loading.dismiss();
      }).catch((e) => {
        console.log('Error getting location', e);
      });
    });
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition().then((resp) => {
        // resp.coords.latitude
        // resp.coords.longitude
        resolve(resp.coords);
       }).catch((error) => {
         reject(error);
       });
    });
  }

  loadMapInfo(coords) {
    return new Promise((resolve, reject) => {
      const latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      const directionsService = new google.maps.DirectionsService;
      const directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.map);
      directionsDisplay.setPanel(this.directionsPanel.nativeElement);
      directionsService.route({
        origin: { lat: coords.latitude, lng: coords.longitude },
        destination: { lat: 6.978858, lng: 3.438929 },
        travelMode: google.maps.TravelMode['DRIVING']
      }, (res, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(res);
          resolve(res);
        } else {
          reject(status);
        }
      });
    });
  }

  nextPage() {
    this.router.navigateByUrl('/about');
  }
}
