export default interface Mapper<D, E> {
     fromDto(dto: D): E;
     toDto(entity: E): D;
}
