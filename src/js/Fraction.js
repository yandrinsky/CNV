class Fraction{
    constructor(num, det = 1) {
        let GCD = this.gcd(num, det);
        this.num = num / GCD;
        this.det = det / GCD;
    }

    gcd(n, m){
        return m === 0 ? n : this.gcd(m, n % m);
    }

    nok(n, m) {
        return n * m / this.gcd(n, m);
    }

    getNum(){
        return this.num;
    }
    getDet(){
        return this.det;
    }
    setNum(num){
        const GCD = this.gcd(num, this.det);
        this.num = num / GCD;
        this.det /= GCD;
        return this;
    }
    setDet(det){
        const GCD = this.gcd(det, this.det);
        this.det = det / GCD;
        this.num /= GCD;
        return this;
    }

    plus(num, det = 1){
        if(num instanceof Fraction){
            det = num.getDet();
            num = num.getNum();
        }
        let NOK = this.nok(det, this.det);
        let NUM = this.num * NOK / this.det + num * NOK / det;
        let GCD = this.gcd(NOK, NUM);
        NOK /= GCD;
        NUM /= GCD;
        this.num = NUM;
        this.det = NOK;
        return this;
    }
    minus(num, det = 1){
        if(num instanceof Fraction){
            det = num.getDet();
            num = num.getNum();
        }
        let NOK = this.nok(det, this.det);
        let NUM = this.num * NOK / this.det - num * NOK / det;
        let GCD = this.gcd(NOK, NUM);
        NOK /= GCD;
        NUM /= GCD;
        this.num = NUM;
        this.det = NOK;
        return this;
    }
    multiply(num, det = 1){
        if(num instanceof Fraction){
            det = num.getDet();
            num = num.getNum();
        }
        let GCD = this.gcd(this.num * num, this.det * det);
        this.num = this.num * num / GCD;
        this.det = this.det * det / GCD;
        return this;
    }
    divide(num, det = 1){
        if(num instanceof Fraction){
            det = num.getDet();
            num = num.getNum();
        }
        let GCD = this.gcd(this.num * det, this.det * num);
        this.num = this.num * det / GCD;
        this.det = this.det * num / GCD;
        return this;
    }
    getStr(){
        if(this.det === 1){
            return `${this.num}`;
        } else if(this.num === 0){
            return `0`;
        } else {
            return `${this.num}/${this.det}`;
        }
    }
    clone(){
        return new Fraction(this.num, this.det);
    }
}

export default Fraction;