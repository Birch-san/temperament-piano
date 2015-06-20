/**
 * Created by birch on 20/06/2015.
 */
export default class Fraction {
	constructor(numerator:int, denominator:int = 1) {
		this.numerator = numerator;
		this.denominator = denominator;
		this.simplify();
	}

	multiply(fractionOrNumerator, denominator = 1) {
		if (!(fractionOrNumerator instanceof Fraction)) {
			return this.multiply(new Fraction(fractionOrNumerator, denominator));
		}
		return new Fraction(
			this.numerator * fractionOrNumerator.numerator,
			this.denominator * fractionOrNumerator.denominator
		);
	}

	divide(fractionOrNumerator, denominator = 1) {
		if (!(fractionOrNumerator instanceof Fraction)) {
			return this.divide(new Fraction(fractionOrNumerator, denominator));
		}
		return this.multiply(fractionOrNumerator.reciprocal());
	}

	reciprocal() {
		return new Fraction(this.denominator, this.numerator);
	}

	simplify(){
		let greatestCommon = (function gcd(a,b){
			return b ? gcd(b, a%b) : a;
		})(this.numerator, this.denominator);
		this.numerator /= greatestCommon;
		this.denominator /= greatestCommon;
	}

	raise(power:int) {
		if (power<0) {
			return this.reciprocal().raise(Math.abs(power));
		}
		return new Fraction(
			Math.pow(this.numerator, power),
			Math.pow(this.denominator, power)
		);
	}

	qualify() {
		return this.numerator/this.denominator;
	}

	equals(frac:Fraction) {
		return this.numerator === frac.numerator
			&& this.denominator === frac.denominator;
	}

	greater(frac:Fraction) {
		return this.qualify() > frac.qualify();
	}

	//toString() {
	//	return this.qualify();
	//}
}