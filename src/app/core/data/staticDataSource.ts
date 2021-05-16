import {Injectable } from "@angular/core";
import { StateTaxes }from "./stateTaxes.model";
import { Observable, from } from "rxjs"

@Injectable()
export class StaticDataSource {
    private stateTaxesData: StateTaxes[] = [
       new StateTaxes ( "Ala",  "AL", 4.00),
       new StateTaxes ("Alaska",  "AK",0.00), 
       new StateTaxes ("Ariz"     ,  "AZ", 5.60 ),
       new StateTaxes ("Ark " ,  "AR", 6.50 ),
       new StateTaxes ("Calif."     ,  "CA", 7.25 ),
       new StateTaxes ("Colo"     ,  "CO", 2.90 ),
       new StateTaxes ("Conn"     ,  "CT", 6.35 ),
       new StateTaxes ("D.C " ,  "DC", 6.00 ),
       new StateTaxes ("Del " ,  "DE", 0.00 ),
       new StateTaxes ("Fla " ,  "FL", 6.00 ),
       new StateTaxes ("Ga  " ,  "GA", 4.00 ),
       new StateTaxes ("Hawaii"  ,  "HI", 4.00 ),
       new StateTaxes ("Idaho "     ,  "ID", 6.00 ),
       new StateTaxes ("Ill " ,  "IL", 6.25 ),
       new StateTaxes ("Ind " ,  "IN", 7.00 ),
       new StateTaxes ("Iowa  " ,  "IA", 6.00 ),
       new StateTaxes ("Kans"     ,  "KS", 6.50 ),
       new StateTaxes ("Ky  " ,  "KY", 6.00 ),
       new StateTaxes ("La  " ,  "LA", 4.45 ),
       new StateTaxes ("Maine "     ,  "ME", 5.50 ),
       new StateTaxes ("Mass"     ,  "MA", 6.25 ),
       new StateTaxes ("Md  " ,  "MD", 6.00 ),
       new StateTaxes ("Mich"     ,  "MI", 6.00 ), 
       new StateTaxes ("Minn"    ,  "MN", 6.875 ),
       new StateTaxes ("Miss"     ,  "MS", 7.00 ), 
       new StateTaxes ("Mo " ,  "MO", 4.225 ),
       new StateTaxes ("Mont"     ,  "MT", 0.00 ),
       new StateTaxes ("N.C " ,  "NC", 4.75 ),
       new StateTaxes ("N.D " ,  "ND", 5.00 ),
       new StateTaxes ("N.H " ,  "NH", 0.00 ),
       new StateTaxes ("N.J"     ,  "NJ", 6.625 ),
       new StateTaxes ("N.M"     ,  "NM", 5.125 ),
       new StateTaxes ("N.Y " ,  "NY", 4.00 ),
       new StateTaxes ("Nebr"     ,  "NE", 5.50 ), 
       new StateTaxes ("Nev " ,  "NV", 6.85 ),
       new StateTaxes ("Ohio  " ,  "OH", 5.75 ),
       new StateTaxes ("Okla"     ,  "OK", 4.50 ),
       new StateTaxes ("Ore " ,  "OR", 0.00 ),
       new StateTaxes ("Pa  " ,  "PA", 6.00 ),
       new StateTaxes ("R.I " ,  "RI", 7.00 ),
       new StateTaxes ("S.C " ,  "SC", 6.00 ),
       new StateTaxes ("S.D " ,  "SD", 4.50 ),
       new StateTaxes ("Tenn"     ,  "TN", 7.00 ),
       new StateTaxes ("Tex " ,  "TX", 6.25 ),
       new StateTaxes ("Utah  "     ,  "UT", 6.10 ),
       new StateTaxes ("Va  " ,  "VA", 5.30 ),
       new StateTaxes ("Vt  " ,  "VT", 6.00 ),
       new StateTaxes ("W.Va"     ,  "WV", 6.00 ),
       new StateTaxes ("Wash"     ,  "WA", 6.50 ),
       new StateTaxes ("Wis " ,  "WI", 5.00 ),
       new StateTaxes ("Wyo " ,  "WY", 4.00 ),
    ]

    getStateTaxes() : Observable<StateTaxes[]> {
        return from ([this.stateTaxesData])
    }
}
