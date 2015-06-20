/**
 * Created by birch on 20/06/2015.
 */
export default class Fraction {
	constructor(numerator:int, denominator:int) {
		this.numerator = numerator;
		this.denominator = denominator;
	}

	multiply(coeff:int) {
		let coeff = new Fraction(numerator, 1);
		return this.multiply(coeff);
	}

	multiply(coeff:Fraction) {
		this.numerator *= coeff.numerator;
		this.denominator *= coeff.denominator;
		this.simplify();
		return this;
	}

	multiply(numerator:int, denominator:int) {
		let coeff = new Fraction(numerator, denominator);
		return this.multiply(coeff);
	}

	divide(coeff:int) {
		let coeff = new Fraction(numerator, 1);
		return this.divide(coeff);
	}

	divide(coeff:Fraction) {
		return this.multiply(coeff.reciprocal());
	}

	divide(numerator:int, denominator:int) {
		let coeff = new Fraction(numerator, denominator);
		return this.divide(coeff);
	}

	reciprocal() {
		return new Fraction(this.denominator, this.numerator);
	}

	simplify(){
		let greatestCommon = function gcd(a,b){
			return b ? gcd(b, a%b) : a;
		}(this.numerator, this.denominator);
		this.numerator /= greatestCommon;
		this.denominator /= greatestCommon;
	}

	qualify() {
		return this.numerator/this.denominator;
	}
}